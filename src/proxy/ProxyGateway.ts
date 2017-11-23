import * as Bluebird from 'bluebird';
import { Headers } from '../http/CachedHttpClient';
import { Proxy } from './Proxy';

/**
 * The ProxyGateway maintains a list of proxy rules, given a URI it will find the appropriate proxy and use it
 */
export class ProxyGateway {

    constructor(private readonly proxies: Proxy[]) {
        for (const proxy of proxies) {
            proxy.on('item', this.cacheItem.bind(this));
        }
    }

    /**
     * Find the first proxy that can handle the given URI and retrieve the item from that proxy
     */
    public get(uri: string, headers: Headers): Bluebird<any> {
        return this.getProxy(uri).get(uri, headers);
    }


    public hasInCache(uri: string, tenant: string): boolean {
        return this.getProxy(uri).has(tenant + uri);
    }

    /**
     * Cache the given item in the correct proxy cache
     */
    public cacheItem(uri: string, tenant: string, item: object): void {
        const p = this.getProxy(uri);
        const x = p.cacheItem(uri, tenant, item);
        // console.log('caching item: ' + tenant + uri);
        // console.log('is it there? ( ' + tenant + uri + ') ' + this.getProxy(uri).has(tenant + uri));
        // console.log('proxy is: ' + (p.regex));
        return x;
    }

    public getProxy(uri: string): Proxy {
        const proxy = this.proxies.find(_ => _.matches(uri));

        if (!proxy) {
            throw new Error(`Proxy not found for ${uri}`);
        }

        return proxy;
    }

}
