const puppeteer = require("puppeteer-extra");
const blockResources = require("puppeteer-extra-plugin-block-resources");
const useProxy = require("puppeteer-page-proxy");

import { Cluster } from "puppeteer-cluster";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Page } from "puppeteer-extra-plugin/dist/puppeteer";
import { Job, Navigation } from "./types/types";

export async function getCluster(): Promise<Cluster> {
  return new Promise(async (resolve) => {
    // puppeteer.use(StealthPlugin());
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: parseInt(process.env.BROWSER_MAX_CONCURRENT),
      puppeteer,
      puppeteerOptions: {
        // @ts-ignore
        headless: process.env.RUN_ENVIRONMENT !== "local",
        args: ["--no-sandbox"],
      },
      monitor: process.env.RUN_ENVIRONMENT == "local",
      timeout: 200000,
    });

    await cluster.task(async ({ page, data: job }) => {
      try {
        await navigateToPage(page, job.navigation);
        job.callbackFunction({ jobId: job.jobId }, null);
      } catch (e) {
        job.callbackFunction({ jobId: job.jobId }, e);
      }
    });

    cluster.on("taskerror", (err, data, willRetry) => {
      if (willRetry) {
        console.warn(
          `Encountered an error while crawling ${data}. ${err.message}\nThis job will be retried`
        );
      } else {
        console.error(`Failed to crawl ${data.jobId}: ${err.message}`);
      }
    });

    resolve(cluster);
  });
}

export async function executeTask(jobs) {
  puppeteer.use(StealthPlugin());
  puppeteer.use(
    blockResources({
      blockedTypes: new Set(["image", "stylesheet", "media"]),
    })
  );

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const browser = await puppeteer.launch({
      headless: process.env.RUN_ENVIRONMENT !== "local",
      args: ["--no-sandbox", `--proxy-server=${job.navigation.agent.proxyUrl}`],
    });
    const page = await browser.newPage();
    try {
      await navigateToPage(page, job.navigation);
      job.callbackFunction({ jobId: job.jobId }, null);
      await browser.close();
    } catch (e) {
      job.callbackFunction({ jobId: job.jobId }, e);
    }
  }
}

const navigateToPage = async (page: Page, navigation: Navigation) => {
  return new Promise(async (resolve, reject) => {
    try {
      await page.setRequestInterception(true);
      page.on("request", async (request) => {
        if (
          ["image", "stylesheet", "media", "font"].includes(
            request.resourceType()
          )
        ) {
          request.abort();
        } else {
          await useProxy(request, `http://${navigation.agent.proxyUrl}`);
        }
      });
      await page.setUserAgent(navigation.userAgent);
      await page.setViewport({
        width: 1200,
        height: 800,
      });
      // navigate to page
      await page.goto(
        `${navigation.destination}?keyword=${navigation.keyword}`,
        {
          waitUntil: "load",
          timeout: 60000,
          referer: navigation.referer, // specify referrer
        }
      );
      let timeToWait = randomizeTimeToWait(navigation.timeToWait);

      await page.waitForTimeout((timeToWait * 1000) / 3);
      await page.$eval("body", (el: any) => el.click());
      await page.waitForTimeout((timeToWait * 1000) / 3);
      await autoScroll(page);
      await page.waitForTimeout((timeToWait * 1000) / 3);
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

      // clear cookies
      // const client = await page.target().createCDPSession();
      // await client.send("Network.clearBrowserCookies");
      // await client.send("Network.clearBrowserCache");
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const autoScroll = async (page) => {
  return new Promise(async (resolve) => {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    resolve(true);
  });
};

const randomizeTimeToWait = (timeToWait) => {
  let randomTime = Math.random() * timeToWait * 0.1;
  let isNegative = Math.random() > 0.5;
  return isNegative ? (timeToWait -= randomTime) : (timeToWait += randomTime);
};
