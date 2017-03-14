
import {Headers} from "./CachedHttpClient";
import ProxyGateway from "../proxy/ProxyGateway";

/**
 * The RecursiveHttpRequest will resolve any URI given to it, scanning the result for more URI's to resolve and storing
 * all URI's that have been resolve in a links object.
 */
export default class RecursiveHttpRequest {
  public readonly links: UriObjectMap = {};

  constructor(
    private readonly proxy: ProxyGateway,
    private readonly headers: Headers
  ) {}

  /**
   * Use the ProxyGateway to get the given URI item then scan the resulting item for any nested links that need to be
   * resolved.
   */
  public async resolve(uri: string): Promise<void> {
    if (this.links[uri]) {
      return Promise.resolve();
    }

    const item = await this.proxy.get(uri, this.headers);

    this.links[uri] = item;

    await this.resolveNestedLinks(item);
  }

  /**
   * Recursively iterate through the values in an object checking for an links that need to be resolved
   */
  private async resolveNestedLinks(item: Object): Promise<void> {
    for (const key in item) {
      if (typeof item[key] === "string" && /^\/[a-zA-Z-]+\//.test(item[key])) {
        await this.resolve(item[key]);
      }
      else if (typeof item[key] === "object" && item[key] !== null) {
        await this.resolveNestedLinks(item[key]);
      }
    }
  }

}

/**
 * Shape of a link item, "/station/1": { ... }
 */
export type UriObjectMap = {
  [uri: string]: any
}
