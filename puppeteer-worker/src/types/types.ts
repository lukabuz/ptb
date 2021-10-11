export interface Job {
  agent: Agent;
  navigations: Navigation[];
}

export interface Navigation {
  timeToWait: number;
  referer: string;
  destination: string;
  userAgent: string;
  successCheck?: NavigationSuccessCriteria;
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
