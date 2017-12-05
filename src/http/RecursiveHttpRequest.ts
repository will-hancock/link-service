import { Headers } from './CachedHttpClient';
import { ProxyGateway } from '../proxy/ProxyGateway';

/**
 * The RecursiveHttpRequest will resolve any URI given to it, scanning the result for more URI's to resolve and storing
 * all URI's that have been resolve in a links object.
 */
export class RecursiveHttpRequest {
    public readonly links: UriObjectMap = {};

    constructor(private readonly proxy: ProxyGateway,
                private readonly headers: Headers) {
    }

    /**
     * Use the ProxyGateway to get the given URI item then scan the resulting item for any nested links that need to be
     * resolved.
     *
     * Any items in the blacklist are not resolved
     */
    public async resolve(uri: string, blacklist: string[]): Promise<void> {
        if (this.links[uri]) {
            return Promise.resolve();
        }

        /* @todo - "CODE of shame" hotfix until we solve CORE-855 */
        if (/^\/(tbo-)?user\/[0-9]+$/.test(uri)) {
            this.links[uri] = [];
            return Promise.resolve();
        }

        const headersWithBlacklist = this.headers;
        headersWithBlacklist['x-links-blacklist'] = JSON.stringify(blacklist);
        const item = await this.proxy.get(uri, headersWithBlacklist);

        this.links[uri] = item;

        await this.resolveNestedLinks(item, blacklist);
    }

    /**
     * Recursively iterate through the values in an object checking for an links that need to be resolved
     */
    private async resolveNestedLinks(item: Object, blacklist: string[]): Promise<void> {
        for (const key in item) {
            if (typeof item[key] === 'string' && // check value is a string
                /^\/[a-zA-Z-]+\//.test(item[key]) && // see if it looks like a URI
                blacklist.indexOf(item[key]) === -1) { // make sure it's not blacklisted
                await this.resolve(item[key], blacklist);
            }
            else if (typeof item[key] === 'object' && item[key] !== null) {
                await this.resolveNestedLinks(item[key], blacklist);
            }
        }
    }

}

/**
 * Shape of a link item, "/station/1": { ... }
 */
export type UriObjectMap = {
    [uri: string]: any;
};
