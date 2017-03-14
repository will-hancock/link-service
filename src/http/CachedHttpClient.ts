
import RecursiveHttpRequest from "./RecursiveHttpRequest";
import {UriObjectMap} from "./RecursiveHttpRequest";
import ProxyGateway from "../proxy/ProxyGateway";

/**
 * The CachedHttpClient will send a RecursiveHttpRequest on to the ProxyGateway, waiting until every link has been
 * resolved before giving the response.
 */
export default class CachedHttpClient {

  constructor(
    private readonly proxy: ProxyGateway
  ) {}

  /**
   * Turn the given list of links into a fully resolved set of objects
   */
  public async get(req: Request): Promise<Response> {
    console.log(req);

    const result = new RecursiveHttpRequest(this.proxy, req.headers);

    await Promise.all(req.links.map(uri => result.resolve(uri)));

    return { links: result.links };
  }

}

/**
 * Shape of the response object
 *
 * links: {
 *   "/station/1": { ... }
 * }
 */
interface Response {
  links: UriObjectMap;
}

/**
 * Shape of the request headers e.g.
 *
 * "X-TENANT": "genius"
 */
export type Headers = {
  [header: string]: string | number
};

/**
 * Request links and headers
 */
interface Request {
  links: string[];
  headers: Headers;
}

