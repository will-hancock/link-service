import * as Bluebird from 'bluebird';
import * as request from 'request-promise';
import {option} from 'ts-option';
import {EventEmitter} from 'events';
import {Cache} from 'lru-cache';
import {Logger} from '../logger/Logger';
import {UriObjectMap} from '../http/RecursiveHttpRequest';
import {Headers} from '../http/CachedHttpClient';

/**
 * The Proxy class resolves URIs with either a HTTP request or using it's local cache
 */
export class Proxy extends EventEmitter {

    constructor(private readonly baseUrl: string,
                private readonly regex: RegExp,
                private readonly cache: Cache<string, object>,
                private readonly logger: Logger) {
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
    public get(uri: string, headers: Headers): Bluebird<object> {
        const cacheResult = this.cache.get(uri);

        return option(cacheResult).match({
            some: item => Bluebird.resolve(item),
            none: () => this.getViaHttp(uri, headers)
        });
    }

    private getViaHttp(uri: string, headers: Headers): Bluebird<object> {
        this.logger.info(`Cache miss. Sending request to ${this.baseUrl + uri}`);

        const options = {
            uri: this.baseUrl + uri,
            headers: headers,
            json: true,
            gzip: true,
            transform2xxOnly: true,
            transform: (body, response) => this.handleHttpResponse(body, response, uri)
        };

        return request(options);
    }

    private handleHttpResponse(body: ServiceResponse, response: Response, uri: string): object {
        const result = body.data;
        const links = body.links;

        this.cache.set(uri, result, response.headers['max-age']);

        if (links) {
            for (const linkUri in links) {
                if (links.hasOwnProperty(linkUri)) {
                    // bubble up the links we get to the gateway so they can be cached in the correct bucket
                    this.emit('item', linkUri, links[linkUri]);
                }
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
    public cacheItem(uri: string, item: object): void {
        this.cache.set(uri, item);
    }

}

interface ServiceResponse {
    data: Object;
    links: UriObjectMap;
}
