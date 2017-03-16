
import Config from "./common";

const DEFAULT_MAX_AGE = 10*60*60*24;

export default class TestConfig extends Config {

  public baseUrl = "http://$serviceName.test.aws.assertis";

  public proxies = {
    "^\/station\/.+": {
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
    "^\/route\/[0-9]+": {
      name: "ride-service",
      cacheConfig: { maxAge: DEFAULT_MAX_AGE, max: 200 }
    }

  }


}