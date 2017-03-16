
import Config from "../../config/common";
import DevConfig from "../../config/dev";
import KoaService from "./KoaService";
import CachedHttpClient from "../http/CachedHttpClient";
import ProxyGateway from "../proxy/ProxyGateway";
import Proxy from "../proxy/Proxy";
import LRU = require("lru-cache");
import winston = require("winston");
import memoize = require("memoized-class-decorator");
import TestConfig from "../../config/test";

export default class Container {

  @memoize
  public getConfig(): Config {
    switch (process.env.NODE_ENV) {
      case "test": return new TestConfig();
      default: return new DevConfig();
    }
  }

  @memoize
  public getKoaService(): KoaService {
    return new KoaService(this.getCachedHttpClient(), this.getConfig().koaPort);
  }

  @memoize
  public getCachedHttpClient(): CachedHttpClient {
    return new CachedHttpClient(this.getProxyGateway());
  }

  @memoize
  public getProxyGateway(): ProxyGateway {
    return new ProxyGateway(this.getProxies());
  }

  @memoize
  public getProxies(): Proxy[] {
    const baseUrl = this.getConfig().baseUrl;
    const proxies = this.getConfig().proxies;

    return Object.keys(proxies).map(proxyRegex => new Proxy(
      baseUrl.replace("$serviceName", proxies[proxyRegex].name),
      new RegExp(proxyRegex),
      new LRU(proxies[proxyRegex].cacheConfig)
    ));
  }

}

export const logger = new winston.Logger({
  levels: winston.config.syslog.levels,
  colors: winston.config.syslog.colors
});

logger.add(winston.transports.Console);