
import Koa = require("koa");
import compress = require("koa-compress");
import responseTime = require("koa-response-time");
import Context = Koa.Context;
import Middleware = Koa.Middleware;
import CachedHttpClient from "../http/CachedHttpClient";
import {StatusCodeError} from "request-promise/errors";
import {logger} from "./Container";

export default class KoaService {

  constructor(
    private readonly httpClient: CachedHttpClient,
    private readonly koaPort: number
  ) { }

  /**
   * Start the koa server
   */
  public start(): void {
    const app = new Koa();

    app.use(responseTime());
    app.use(compress());
    app.use(this.handler.bind(this));

    app.listen(this.koaPort);
  }

  /**
   * Handle journey planning requests.
   *
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  private async handler(ctx: Context, next) {
    if (ctx.request.path !== "/resolve") return;

    try {
      ctx.body = await this.httpClient.get({
        links: JSON.parse(ctx.request.query.links),
        headers: pick(ctx.headers, "X-AUTH-TOKEN", "X-ENV", "X-TENANT", "user-agent", "accept", "accept-encoding")
      });
    }
    catch (err) {
      if (err instanceof StatusCodeError) {
        logger.info(err);

        ctx.body = err.error;
        ctx.response.status = err.statusCode;
      }
      else {
        logger.error(err);

        ctx.body = err.message;
        ctx.response.status = 500;
      }
    }
  };

}

function pick(item, ...props) {
  return Object.assign({}, ...props.map(prop => ({[prop]: item[prop]})));
}