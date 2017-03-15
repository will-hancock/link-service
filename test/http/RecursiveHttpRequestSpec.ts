
import * as chai from "chai";
import LRU = require("lru-cache");
import * as spies from "chai-spies";
import ProxyGateway from "../../src/proxy/ProxyGateway";
import Bluebird = require("bluebird");
import RecursiveHttpRequest from "../../src/http/RecursiveHttpRequest";

chai.use(spies);

describe("RecursiveHttpRequest", () => {

  it("should resolve nested links", async () => {
    const spy = chai.spy(_ => Bluebird.resolve({
      "nothing": true,
      "notalink": "notquitealink/",
      "object": {
        "link": "/station/1234"
      }
    }));

    const gateway = new ProxyGateway([]);
    gateway.get = spy;

    const request = new RecursiveHttpRequest(gateway, {});

    await request.resolve("/biscuits/");

    chai.expect(spy).to.have.been.called.exactly(2);
  });

});
