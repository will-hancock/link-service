import {RecursiveHttpRequest, UriObjectMap} from './RecursiveHttpRequest';
import {ProxyGateway} from '../proxy/ProxyGateway';
import {Logger} from '../logger/Logger';

/**
 * The CachedHttpClient will send a RecursiveHttpRequest on to the ProxyGateway, waiting until every link has been
 * resolved before giving the response.
 */
export class CachedHttpClient {

    constructor(private readonly proxy: ProxyGateway,
                private readonly logger: Logger) {
    }

    /**
     * Turn the given list of links into a fully resolved set of objects
     */
    public async get(req: Request): Promise<Response> {
        this.logger.debug(req);
        console.log('got request with links: ' + JSON.stringify(req.links) + ' and blacklist: ' +  JSON.stringify(req.blacklist));
        const result = new RecursiveHttpRequest(this.proxy, req.headers);

        await Promise.all(req.links.map(uri => result.resolve(uri, req.blacklist)));

        return {
            status: 'success',
            links: result.links
        };
    }

}

/**
 * Shape of the response object
 *
 * links: {
 *   "/station/1": { ... }
 * }
 */
export interface Response {
    links: UriObjectMap;
    status: string;
}

/**
 * Shape of the request headers e.g.
 *
 * "X-TENANT": "genius"
 */
export type Headers = {
    [header: string]: string | number;
};

/**
 * Request links and headers
 */
export interface Request {
    links: string[];
    blacklist: string[];
    headers: Headers;
}
