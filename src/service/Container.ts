
import Config from "../../config/common";
import DevConfig from "../../config/dev";
import KoaService from "./KoaService";
import CachedHttpClient from "../http/CachedHttpClient";
import ProxyGateway from "../proxy/ProxyGateway";
import Proxy from "../proxy/Proxy";
const LRU = require("lru-cache");
import memoize = require("memoized-class-decorator");

export default class Container {

  @memoize
  public getConfig(): Config {
    switch (process.env.NODE_ENV) {
      //case "production": return new ProductionConfig();
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