import { executeTask, getCluster } from "./puppet";
const { Cluster } = require("puppeteer-cluster");
import { DatabaseJob, Job, Navigation } from "./types/types";
import PostgresWorker from "./PostgresWorker";
require("dotenv").config({ path: `${__dirname}/../.env` });

(async () => {
  let cluster = await getCluster();

  const jobCallback = (data, err) => {
    if (err !== null) {
      console.log(`Job ID ${data.jobId} had an error!`);
      pgWorker.markJobError(data.jobId, err);
    } else {
      pgWorker.markJobSuccess(data.jobId);
    }
  };

  const prepareAndQueueTask = (rows: DatabaseJob[]) => {
    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];
      let job: Job = {
        jobId: parseInt(element.id),
        navigation: {
          timeToWait: parseInt(element.page_idle_time),
          referer: element.referrer,
          destination: element.destination_url,
          userAgent: element.user_agent,
          keyword: element.keyword,
          agent: {
            proxyUrl: `${element.ip}:${element.port}`,
            proxyUsername:
              element.username == null ? undefined : element.username,
            proxyPassword:
              element.password == null ? undefined : element.password,
          },
        },
        callbackFunction: jobCallback,
      };
      cluster.queue(job);
    }
  };

  const pgWorker = new PostgresWorker(
    {
      connection: {
        user: process.env.DB_USERNAME,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT),
      },
      intervals: {
        reserveIntervalMs: parseInt(process.env.RESERVE_INTERVAL),
        clearReserveIntervalMs: parseInt(process.env.CLEAR_RESERVE_INTERVAL),
        concurrentReserves: parseInt(process.env.RESERVE_MAX_CONCURRENT),
      },
      node_id: process.env.NODE_ID,
    },
    prepareAndQueueTask
  );
})();

const splitToChunks = (array, parts) => {
  let result = [];
  for (let i = parts; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
};
