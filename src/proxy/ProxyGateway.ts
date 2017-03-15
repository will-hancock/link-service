
import * as Bluebird from "bluebird";
import {Headers} from "../http/CachedHttpClient";
import LRU = require("lru-cache");
import Proxy from "./Proxy";

/**
 * The ProxyGateway maintains a list of proxy rules, given a URI it will find the appropriate proxy and use it
 */
export default class ProxyGateway {

  constructor(
    private readonly proxies: Proxy[]
  ) {
    for (const proxy of proxies) {
      proxy.on('item', this.cacheItem);
    }
  }

  /**
   * Find the first proxy that can handle the given URI and retrieve the item from that proxy
   */
  public get(uri: string, headers: Headers): Bluebird<any> {
    return this.getProxy(uri).get(uri, headers);
  }

  /**
   * Cache the given item in the correct proxy cache
   */
  public cacheItem = (uri: string, item: any) => {
    return this.getProxy(uri).cacheItem(uri, item);
  };

  private getProxy(uri: string): Proxy {
    const proxy = this.proxies.find(proxy => proxy.matches(uri));

    if (!proxy) {
      throw new Error(`Proxy not found for ${uri}`);
    }

    return proxy;
  }

}
