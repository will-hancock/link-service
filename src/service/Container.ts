import Config from '../../config/common';
import DevConfig from '../../config/dev';
import KoaService from './KoaService';
import TestConfig from '../../config/test';
import * as memoize from 'memoized-class-decorator';
import * as LRU from 'lru-cache';
import {CachedHttpClient} from '../http/CachedHttpClient';
import {ProxyGateway} from '../proxy/ProxyGateway';
import {Proxy} from '../proxy/Proxy';
import {Logger} from '../logger/Logger';
import {logger} from '../logger/pino';
import LiveConfig from '../../config/live';
import SidConfig from '../../config/sid';
import StageConfig from '../../config/stage';

export class Container {

    @memoize
    public getConfig(): Config {
        switch (process.env.NODE_ENV) {
            case 'live': return new LiveConfig();
            case 'test': return new TestConfig();
            case 'sid': return new SidConfig();
            case 'stage': return new StageConfig();
            default: return new DevConfig();
        }
    }

    @memoize
    public getKoaService(): KoaService {
        return new KoaService(this.getCachedHttpClient(), this.getLogger(), this.getConfig().koaPort);
    }

    @memoize
    public getCachedHttpClient(): CachedHttpClient {
        return new CachedHttpClient(this.getProxyGateway(), this.getLogger());
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
            baseUrl.replace('$serviceName', proxies[proxyRegex].name),
            new RegExp(proxyRegex),
            LRU(proxies[proxyRegex].cacheConfig),
            this.getLogger()
        ));
    }

    @memoize
    public getLogger(): Logger {
        return logger;
    }

}
