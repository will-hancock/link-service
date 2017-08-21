import * as chai from 'chai';
import * as spies from 'chai-spies';
import * as Bluebird from 'bluebird';
import {ProxyGateway} from '../../src/proxy/ProxyGateway';
import {RecursiveHttpRequest} from '../../src/http/RecursiveHttpRequest';

chai.use(spies);

describe('RecursiveHttpRequest', () => {

    it('should resolve nested links', async () => {
        const spy = chai.spy(_ => Bluebird.resolve({
            'nothing': true,
            'notalink': 'notquitealink/',
            'object': {
                'link': '/station/1234'
            }
        }));

        const gateway = new ProxyGateway([]);
        gateway.get = spy;

        const request = new RecursiveHttpRequest(gateway, {});

        await request.resolve('/biscuits/', []);

        chai.expect(spy).to.have.been.called.exactly(2);
    });

    it('should resolve nested links', async () => {
      const spy = chai.spy(_ => Bluebird.resolve({
        'nothing': true,
        'notalink': 'notquitealink/',
        'object': {
          'link': '/station/1234',
          'blacklisted': '/blacklisted/123',
          'not-blacklisted': '/blacklisted/abc'
        }
      }));

      const gateway = new ProxyGateway([]);
      gateway.get = spy;

      const request = new RecursiveHttpRequest(gateway, {});

      await request.resolve('/biscuits/', ['/blacklisted/123']);

      chai.expect(spy).to.have.been.called.exactly(3);
      // waiting for https://github.com/chaijs/chai-spies/issues/71
      // chai.expect(spy).to.have.been.called.with('/biscuits/', '/station/1234', '/blacklisted/abc');
    });

});
