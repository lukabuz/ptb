export interface Job {
  navigation: Navigation;
  jobId: number;
  callbackFunction: Function;
}

export interface Navigation {
  timeToWait: number;
  referer: string;
  destination: string;
  userAgent: string;
  successCheck?: NavigationSuccessCriteria;
  agent: Agent;
}

export interface NavigationSuccessCriteria {
  selector: string;
  expectedValue: string;
  property: string;
}

export interface Agent {
  proxyUrl: string;
  proxyUsername?: string;
  proxyPassword?: string;
}

export interface PostgresWorkerOptions {
  connection: {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
  };
  intervals: {
    reserveIntervalMs: number;
    clearReserveIntervalMs: number;
    concurrentReserves: number;
  };
  node_id: string;
}

export interface DatabaseJob {
  id: string;
  referrer: string;
  keyword: string;
  user_agent: string;
  ip: string;
  port: string;
  auth_type: string;
  username: string;
  password: string;
  page_idle_time: string;
  destination_url: string;
}
