
import * as chai from "chai";
import Proxy from "../../src/proxy/Proxy";
import LRU = require("lru-cache");

describe("Proxy", () => {

  it("knows whether it can retrieve a URI", () => {
    const stationProxy = new Proxy("", /^\/station\/.+/, new LRU());

    chai.expect(stationProxy.matches("/station/1072/2017-01-02")).to.equal(true);
    chai.expect(stationProxy.matches("/station/Q123")).to.equal(true);
    chai.expect(stationProxy.matches("/monkeys/123/2017-01-02")).to.equal(false);
  });

});
