const DEFAULT_MAX_AGE = 1000 * 60; // 60 seconds

interface CacheConfigItem {
  maxAge: number;
  max: number;
}

export type CacheConfig = {
  [key: string]: CacheConfigItem
}

interface ProxyConfigItem {
  name: string;
  cacheConfig: CacheConfig;
}

export type ProxyConfig = {
  [uriRegex: string]: ProxyConfigItem
}

export default class Config {

  public readonly baseUrl = "http://$serviceName.local";
  public readonly koaPort = 9000;

  public readonly proxies = {
    "^\/station\/[a-zA-Z0-9]+": {
      name: "ride-service",
      cacheConfig: { maxAge: DEFAULT_MAX_AGE, max: 4000 }
    },
    "^\/ticket-type\/[a-zA-Z0-9]+": {
      name: "ride-service",
      cacheConfig: { maxAge: DEFAULT_MAX_AGE, max: 500 }
    },
    "^\/validity-type\/[a-zA-Z0-9]+": {
      name: "ride-service",
      cacheConfig: { maxAge: DEFAULT_MAX_AGE, max: 100 }
    },
    "^\/restriction\/[a-zA-Z0-9]+": {
      name: "ride-service",
      cacheConfig: { maxAge: DEFAULT_MAX_AGE, max: 500 }
    },
    "^\/route\/0-9]+": {
      name: "ride-service",
      cacheConfig: { maxAge: DEFAULT_MAX_AGE, max: 200 }
    }

  }

}


