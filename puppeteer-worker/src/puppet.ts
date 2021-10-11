const puppeteer = require("puppeteer-extra");
const { Cluster } = require("puppeteer-cluster");
const blockResources = require("puppeteer-extra-plugin-block-resources");
const useProxy = require("puppeteer-page-proxy");

import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Job, Navigation } from "./types/types";

puppeteer.use(StealthPlugin());
puppeteer.use(
  blockResources({
    blockedTypes: new Set(["image", "stylesheet", "media"]),
  })
);

export function initializeCluster(maxConcurrency: number): any {
  return new Promise(async (resolve, reject) => {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      puppeteerOptions: { headless: false },
      maxConcurrency: maxConcurrency,
      puppeteer: puppeteer,
    });

    await cluster.task(async ({ page, data: job }) => {
      try {
        await navigateToPage(page, job.navigation);
        job.callbackFunction({ jobId: job.jobId }, null);
      } catch (e) {
        job.callbackFunction({ jobId: job.jobId }, e);
      }
    });

    resolve(cluster);
  });
}

const navigateToPage = async (page, navigation: Navigation) => {
  return new Promise(async (resolve, reject) => {
    try {
      await page.setUserAgent(navigation.userAgent);
      await useProxy(page, `http://${navigation.agent.proxyUrl}`);
      await page.setViewport({
        width: 1200,
        height: 800,
      });
      // navigate to page
      await page.goto(navigation.destination, {
        referer: navigation.referer, // specify referrer
      });
      await page.waitForTimeout(navigation.timeToWait / 3);
      await page.$eval("body", (el) => el.click());
      await page.waitForTimeout(navigation.timeToWait / 3);
      // await autoScroll(page);
      await page.waitForTimeout(navigation.timeToWait / 3);

      if (navigation.successCheck != undefined) {
        const valueToCheck = await page.$eval(
          navigation.successCheck.selector,
          (el, prop) => el[prop],
          navigation.successCheck.property
        );
        console.log(
          valueToCheck == navigation.successCheck.expectedValue
            ? "Success"
            : "Fail"
        );
      }
      // clear cookies
      const client = await page.target().createCDPSession();
      await client.send("Network.clearBrowserCookies");
      await client.send("Network.clearBrowserCache");
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};
