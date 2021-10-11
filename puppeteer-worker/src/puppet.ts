const puppeteer = require("puppeteer-extra");
const blockResources = require("puppeteer-extra-plugin-block-resources");
const useProxy = require("puppeteer-page-proxy");

import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Job } from "./types/types";

puppeteer.use(StealthPlugin());
puppeteer.use(
  blockResources({
    blockedTypes: new Set(["image", "stylesheet", "media"]),
  })
);

export async function execute(job: Job) {
  // Launch browser and navigate to new page

  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${job.agent.proxyUrl}`, "--incognito"],
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1200,
    height: 800,
  });

  // if (job.agent.proxyUsername && job.agent.proxyPassword) {
  //   // This is a workaround since chromium does not allow proxy credentials as args
  //   await page.authenticate({
  //     username: job.agent.proxyUsername,
  //     password: job.agent.proxyPassword,
  //   });
  // }

  // // loop through each navigation and execute it
  for (let i = 0; i < job.navigations.length; i++) {
    const navigation = job.navigations[i];

    await page.setUserAgent(navigation.userAgent);
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
  }
}

const navigateToPage = async () => {};
