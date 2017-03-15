
import LRU = require("lru-cache");
import {option} from "ts-option";
import * as Bluebird from "bluebird";
import * as request from "request-promise";
import {Headers} from "../http/CachedHttpClient";
import {UriObjectMap} from "../http/RecursiveHttpRequest";
import {EventEmitter} from "events";

/**
 * The Proxy class resolves URIs with either a HTTP request or using it's local cache
 */
export default class Proxy extends EventEmitter {

  constructor(
    private readonly baseUrl: string,
    private readonly regex: RegExp,
    private readonly cache: LRU
  ) {
    super();
  }

  /**
   * This method checks that the given uri matches the regular expression for this proxy
   */
  public matches(uri: string): boolean {
    return this.regex.test(uri);
  }

  /**
   * This method will attempt to get the given URI from the cache, if it is not available it will send a HTTP request
   * and then cache both the result and the links in the response.
   */
  public get(uri: string, headers: Headers): Bluebird<any> {
    const cacheResult = this.cache.get(uri);

    return option(cacheResult).match({
      some: item => Bluebird.resolve(item),
      none: () => Bluebird.resolve(this.getViaHttp(uri, headers))
    });
  }

  private async getViaHttp(uri: string, headers: Headers) {
    console.log(`Sending request to ${this.baseUrl + uri}`);

    const options = {
      uri: this.baseUrl + uri,
      headers: headers,
      json: true,
      transform2xxOnly: true,
      transform: (body, response) => this.handleHttpResponse(body, response, uri)
    };

    try {
      return await request(options)
    }
    catch (err) {
      console.error(`Error sending request ${this.baseUrl + uri}\n${err.stack}`);
    }
  }

  private handleHttpResponse(body: ServiceResponse, response: Response, uri: string) {
    const result = body.data;
    const links = body.links;

    this.cache.set(uri, result, response.headers["max-age"]);

    if (links) {
      for (const linkUri in links) {
        // bubble up the links we get to the gateway so they can be cached in the correct bucket
        this.emit('item', linkUri, links[linkUri]);
      }
    }

    return result;
  }

  /**
   * Add the given item to the proxies cache
   *
   * @param uri
   * @param item
   */
  public cacheItem(uri: string, item: any) {
    this.cache.set(uri, item);
  }

}

interface ServiceResponse {
  data: Object;
  links: UriObjectMap
}