
import * as chai from "chai";
import Proxy from "../../src/proxy/Proxy";
import LRU = require("lru-cache");
import * as spies from "chai-spies";
import ProxyGateway from "../../src/proxy/ProxyGateway";
import Bluebird = require("bluebird");

chai.use(spies);

describe("ProxyGateway", () => {

  it("Get's the first proxy that can handle the URI", () => {
    const firstSpy = chai.spy(_ => Bluebird.resolve({}));
    const secondSpy = chai.spy(_ => Bluebird.resolve({}));

    const stationProxy = new Proxy("", /^\/station\/.+/, new LRU());
    stationProxy.get = firstSpy;

    const ticketTypeProxy = new Proxy("", /^\/ticket-type\/.+/, new LRU());
    ticketTypeProxy.get = secondSpy;

    const gateway = new ProxyGateway([stationProxy, ticketTypeProxy]);

    gateway.get("/ticket-type/SOS", {});

    chai.expect(firstSpy).to.not.have.been.called();
    chai.expect(secondSpy).to.have.been.called();
  });

  it("Throws an exception if there is no proxy set up", () => {
    const stationProxy = new Proxy("", /^\/station\/.+/, new LRU());
    const ticketTypeProxy = new Proxy("", /^\/ticket-type\/.+/, new LRU());

    const gateway = new ProxyGateway([stationProxy, ticketTypeProxy]);

    chai.expect(_ => gateway.get("/biscuits-and-cheese/with-wine", {})).to.throw("Proxy not found for /biscuits-and-cheese/with-wine");
  });

});
