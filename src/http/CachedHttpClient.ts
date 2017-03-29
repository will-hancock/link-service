import {RecursiveHttpRequest, UriObjectMap} from './RecursiveHttpRequest';
import {ProxyGateway} from '../proxy';
import {Logger} from '../logger';

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

        const result = new RecursiveHttpRequest(this.proxy, req.headers);

        await Promise.all(req.links.map(uri => result.resolve(uri)));

        return {
            status: 'success',
            links: result.links,
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
interface Response {
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
interface Request {
    links: string[];
    headers: Headers;
}
