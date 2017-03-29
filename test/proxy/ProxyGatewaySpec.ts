import * as chai from 'chai';
import * as spies from 'chai-spies';
import * as LRU from 'lru-cache';
import * as Bluebird from 'bluebird';
import {loggerStub} from '../../src/logger/mockLogger';
import {ProxyGateway} from '../../src/proxy/ProxyGateway';
import {Proxy} from '../../src/proxy/Proxy';

chai.use(spies);

describe('ProxyGateway', () => {

    it('Get\'s the first proxy that can handle the URI', () => {
        const firstSpy = chai.spy(_ => Bluebird.resolve({}));
        const secondSpy = chai.spy(_ => Bluebird.resolve({}));

        const stationProxy = new Proxy('', /^\/station\/.+/, LRU({}), loggerStub);
        stationProxy.get = firstSpy;

        const ticketTypeProxy = new Proxy('', /^\/ticket-type\/.+/, LRU({}), loggerStub);
        ticketTypeProxy.get = secondSpy;

        const gateway = new ProxyGateway([stationProxy, ticketTypeProxy]);

        gateway.get('/ticket-type/SOS', {});

        chai.expect(firstSpy).to.not.have.been.called();
        chai.expect(secondSpy).to.have.been.called();
    });

    it('Throws an exception if there is no proxy set up', () => {
        const stationProxy = new Proxy('', /^\/station\/.+/, LRU({}), loggerStub);
        const ticketTypeProxy = new Proxy('', /^\/ticket-type\/.+/, LRU({}), loggerStub);

        const gateway = new ProxyGateway([stationProxy, ticketTypeProxy]);

        chai.expect(_ => gateway.get('/biscuits-and-cheese/with-wine', {}))
            .to.throw('Proxy not found for /biscuits-and-cheese/with-wine');
    });

});
