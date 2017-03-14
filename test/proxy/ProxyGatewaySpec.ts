
import * as chai from "chai";
import Proxy from "../../src/proxy/Proxy";
import LRU = require("lru-cache");
import * as spies from "chai-spies";
import ProxyGateway from "../../src/proxy/ProxyGateway";
import Bluebird = require("bluebird");

chai.use(spies);

describe("ProxyGateway", () => {

  it("Get's the first proxy that can handle the URI", () => {
    const stationProxy = new Proxy("", /^\/station\/.+/, new LRU());
    stationProxy.get = _ => Bluebird.resolve({});

    const ticketTypeProxy = new Proxy("", /^\/ticket-type\/.+/, new LRU());
    ticketTypeProxy.get = _ => Bluebird.resolve({});

    const gateway = new ProxyGateway([stationProxy, ticketTypeProxy]);

    const firstSpy = chai.spy(stationProxy.get);
    const secondSpy = chai.spy(ticketTypeProxy.get);

    gateway.get("/ticket-type/SOS", {});

    chai.expect(firstSpy).to.not.have.been.called();
    chai.expect(secondSpy).to.have.been.called();
  });

});
