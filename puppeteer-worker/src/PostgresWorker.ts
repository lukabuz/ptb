import { PostgresWorkerOptions } from "./types/types";

const { Client } = require("pg");

export default class PostgresWorker {
  private options: PostgresWorkerOptions;
  private prepareAndQueueTask;

  constructor(options: PostgresWorkerOptions, prepareAndQueueTask) {
    console.log(
      "Initialized PostgresWorker with config ",
      // @ts-ignore
      JSON.stringify(options, 0, 2)
    );
    this.options = options;
    this.prepareAndQueueTask = prepareAndQueueTask;

    setInterval(
      () => this.reserveJobs(),
      this.options.intervals.reserveIntervalMs
    );

    setInterval(() => this.closeFinishedOrders(), 3600000);

    setInterval(() => this.clearAbandonedJobs(), 30000);
  }

  public async query(query): Promise<any> {
    return new Promise((resolve, reject) => {
      const client = new Client(this.options.connection);
      client.connect();
      client.query(query, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
        client.end();
      });
    });
  }

  private async executeReservedJobs(ids) {
    let response = await this.query(`
        select
            j.id,
            j.referrer,
            j.keyword,
            j.user_agent,
            j.destination_url,
            p.ip,
            p.port,
            p.auth_type,
            p.username,
            p.password,
            o.page_idle_time
        from
            jobs j
        left join proxies p on
            j.proxy_id = p.id
        left join orders o on
            j.order_id = o.id
        where
            j.id in (${ids.join(",")})
        `);
    if (response["rows"].length > 0) {
      console.log(`Queueing ${response["rows"].length} jobs`);
      this.prepareAndQueueTask(response["rows"]);
    }
  }

  private async reserveJobs() {
    let count = await this.query(`
        select
            count(*)
        from
            jobs
        where
            node_id = '${this.options.node_id}'
            and execute_after < now()
            and status in ('NEW', 'IN_PROGRESS')
    `);
    if (count.rows[0].count < this.options.intervals.concurrentReserves) {
      let response = await this.query(`
        update
            jobs
        set
            node_id = '${this.options.node_id}',
            status = 'IN_PROGRESS',
            reserved_on = now()
        where
            id in(
            select
                id
            from
                jobs
            where
                execute_after < now()
                and status = 'NEW'
                and node_id is null order by execute_after asc limit ${this.options.intervals.concurrentReserves} )
        RETURNING id
    `);
      if (response.rowCount > 0) {
        console.log(`Reserved ${response.rowCount} jobs, executing`);
        this.executeReservedJobs(response.rows.map((val) => val.id));
      }
    }
  }

  public async markJobError(jobId, error) {
    await this.query(`
        update
            jobs
        set
            status = 'NODE_ERROR',
            executed_on = '${new Date().toISOString()}',
            error_dump = '${error.toString()}'
        where
            id = '${jobId}'
    `);
  }

  public async markJobSuccess(jobId) {
    console.log(`Completed Job ${jobId}`);
    await this.query(`
        update
            jobs
        set
            status = 'COMPLETED',
            executed_on = '${new Date().toISOString()}'
        where
            id = '${jobId}'
    `);
  }

  private async closeFinishedOrders() {
    console.log("Closing finished orders");
    await this.query(`
        update
          orders o
        set
          status = 'COMPLETED'
        where
          o.status = 'IN_PROGRESS'
          and (
          select
            count(*)
          from
            jobs j
          where
            j.order_id = o.id
            and j.status in ('NEW', 'IN_PROGRESS')) = 0
    `);
  }

  private async clearAbandonedJobs() {
    await this.query(`
        update
          jobs
        set
          status = 'NODE_ERROR',
          error_dump = 'Reservation timeout'
        where
          age(now(), reserved_on) > '5 minutes'
          and status = 'IN_PROGRESS'
    `);
  }
}
