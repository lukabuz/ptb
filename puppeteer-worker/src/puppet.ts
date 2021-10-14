const puppeteer = require("puppeteer-extra");
const { Cluster } = require("puppeteer-cluster");
const blockResources = require("puppeteer-extra-plugin-block-resources");
const useProxy = require("puppeteer-page-proxy");

import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Job, Navigation } from "./types/types";

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
      headless: false,
      args: ["--no-sandbox", `--proxy-server=${job.navigation.agent.proxyUrl}`],
    });
    const page = await browser.newPage();
    try {
      await navigateToPage(page, job.navigation);
      job.callbackFunction({ jobId: job.jobId }, null);
    } catch (e) {
      job.callbackFunction({ jobId: job.jobId }, e);
    } finally {
      await browser.close();
    }
  }
}

const navigateToPage = async (page, navigation: Navigation) => {
  return new Promise(async (resolve, reject) => {
    try {
      await page.setUserAgent(navigation.userAgent);
      await page.setViewport({
        width: 1200,
        height: 800,
      });
      // navigate to page
      await page.goto(
        `${navigation.destination}?keyword=${navigation.keyword}`,
        {
          referer: navigation.referer, // specify referrer
        }
      );
      await page.waitForTimeout((navigation.timeToWait * 1000) / 3);
      await page.$eval("body", (el) => el.click());
      await page.waitForTimeout((navigation.timeToWait * 1000) / 3);
      await autoScroll(page);
      await page.waitForTimeout((navigation.timeToWait * 1000) / 3);

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

const autoScroll = async (page) => {
  return new Promise(async (resolve) => {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    resolve(true);
  });
};
