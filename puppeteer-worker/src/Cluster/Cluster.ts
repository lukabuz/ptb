// import { Browser } from "puppeteer";
// import { Job } from "../types/types";
// import Queue from "./Queue";
// import StealthPlugin from "puppeteer-extra-plugin-stealth";
// const blockResources = require("puppeteer-extra-plugin-block-resources");
// const puppeteerVanilla = require("puppeteer");

// export interface Worker {
//   browserObject: Browser;
//   isBusy: boolean;
//   id: number;
// }

// export default class Cluster {
//   private maxConcurrentBrowsers: number;
//   private puppeteer: any;
//   private workers: Worker[];
//   private browserOptions: any;
//   private queue: Queue<Job>;

//   constructor({ maxConcurrentBrowsers, puppeteer, browserOptions }) {
//     this.maxConcurrentBrowsers = maxConcurrentBrowsers;
//     this.puppeteer = puppeteer || puppeteerVanilla;
//     this.browserOptions = browserOptions;
//     this.workers = [];
//     this.queue = new Queue<Job>();

//     this.puppeteer.use(StealthPlugin());
//     this.puppeteer.use(
//       blockResources({
//         blockedTypes: new Set(["image", "stylesheet", "media"]),
//       })
//     );

//     this.initWorkers();
//   }

//   private async initWorkers() {
//     console.log(`Launching ${this.maxConcurrentBrowsers} browsers`);
//     for (let i = 0; i < this.maxConcurrentBrowsers; i++) {
//       try {
//         let workerBrowser = await this.puppeteer.launch(this.browserOptions);
//         this.workers.push({
//           browserObject: workerBrowser,
//           isBusy: false,
//           id: i,
//         });
//       } catch (e) {
//         console.error(`Unable to launch browser ${i}`, e);
//       }
//     }
//     return;
//   }

//   private async areWorkersFree() {
//     return this.workers.filter((worker) => !worker.isBusy).length > 0;
//   }

//   private async getWorker() {
//     return this.workers.find((worker) => !worker.isBusy);
//   }

//   private async takeAndExecuteJobFromQueue() {
//     if (this.areWorkersFree()) {
//       const job: Job = this.queue.get();
//       if (job != null) {
//         this.getWorker().browserObject;
//       }
//     }
//   }

//   public async queueJob(job: Job) {
//     this.queue.queue(job);
//   }

//   private async executeJob(job: Job, page) {
//     const browser = await puppeteer.launch({
//         headless: true,
//         args: [, `--proxy-server=${job.navigation.agent.proxyUrl}`],
//       });
//       const page = await browser.newPage();
//       try {
//         await navigateToPage(page, job.navigation);
//         job.callbackFunction({ jobId: job.jobId }, null);
//         await page.close();
//       } catch (e) {
//         job.callbackFunction({ jobId: job.jobId }, e);
//       }
//   }
// }
