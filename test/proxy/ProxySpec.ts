import * as chai from 'chai';
import * as LRU from 'lru-cache';
import {Proxy} from '../../src/proxy/Proxy';
import {loggerStub} from '../../src/logger/mockLogger';
import {Cache} from 'lru-cache';

describe('Proxy', () => {

    it('knows whether it can retrieve a URI', () => {
        const stationProxy = new Proxy('', /^\/station\/.+/, LRU({}), loggerStub);

        chai.expect(stationProxy.matches('/station/1072/2017-01-02')).to.equal(true);
        chai.expect(stationProxy.matches('/station/Q123')).to.equal(true);
        chai.expect(stationProxy.matches('/monkeys/123/2017-01-02')).to.equal(false);
    });

    it('uses the tenant header to cache an item', () => {
        const cache: Cache<string, object> = LRU({});
        const stationProxy = new Proxy('', /^\/station\/.+/, cache, loggerStub);
        const item = {};

        stationProxy.cacheItem('/station/Q123', 'tenant', item);

        chai.expect(cache.get('tenant/station/Q123')).to.equal(item);
    });

    it('uses the tenant header to retrieve an item', async () => {
        const cache: Cache<string, object> = LRU({});
        const stationProxy = new Proxy('', /^\/station\/.+/, cache, loggerStub);
        const item = {};

        stationProxy.cacheItem('/station/Q123', 'tenant', item);
        const result = await stationProxy.get('/station/Q123', { 'x-tenant': 'tenant' });

        chai.expect(result).to.equal(item);
    });

});
