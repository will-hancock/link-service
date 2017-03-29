import * as chai from 'chai';
import * as LRU from 'lru-cache';
import {Proxy} from '../../src/proxy';
import {loggerStub} from '../../src/logger';

describe('Proxy', () => {

    it('knows whether it can retrieve a URI', () => {
        const stationProxy = new Proxy('', /^\/station\/.+/, LRU({}), loggerStub);

        chai.expect(stationProxy.matches('/station/1072/2017-01-02')).to.equal(true);
        chai.expect(stationProxy.matches('/station/Q123')).to.equal(true);
        chai.expect(stationProxy.matches('/monkeys/123/2017-01-02')).to.equal(false);
    });

});
