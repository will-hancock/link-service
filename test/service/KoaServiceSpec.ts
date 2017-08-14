import * as chai from 'chai';
import KoaService from '../../src/service/KoaService';

describe('KoaService', () => {

    it('decodes links', () => {
        const context = {
            request: {
                query: {
                    links: '["/some/uri","/another/uri"]'
                }
            },
            headers: {}
        };

        const request = KoaService.buildRequest(cast(context));

        chai.expect(request.links[0]).to.equal('/some/uri');
        chai.expect(request.links[1]).to.equal('/another/uri');
        chai.expect(request.blacklist.length).to.equal(0);
    });

    it('picks headers', () => {
        const context = {
            request: {
                query: {
                    links: '["/some/uri","/another/uri"]'
                }
            },
            headers: {
                host: 'localhost',
                'x-tenant': 'bob'
            }
        };

        const request = KoaService.buildRequest(cast(context));

        chai.expect(request.headers['x-tenant']).to.equal('bob');
        chai.expect(request.headers['host']).to.be.undefined;
    });

    it('adds blacklisted URIs', () => {
        const context = {
            request: {
                query: {
                    links: '[]',
                    blacklist: '["/some/uri","/another/uri"]'
                }
            },
            headers: {}
        };

        const request = KoaService.buildRequest(cast(context));

        chai.expect(request.blacklist[0]).to.equal('/some/uri');
        chai.expect(request.blacklist[1]).to.equal('/another/uri');
    });

});

/**
 * Type erasure
 */
function cast(context) {
    return context;
}