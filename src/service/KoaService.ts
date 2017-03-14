
import Koa = require("koa");
import Context = Koa.Context;
import Middleware = Koa.Middleware;
import CachedHttpClient from "../http/CachedHttpClient";

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

    ctx.body = await this.httpClient.get({
      links: JSON.parse(ctx.request.query.links),
      headers: pick(ctx.headers, "X-TENANT", "user-agent", "accept", "accept-encoding")
    });
  };

}

function pick(item, ...props) {
  return Object.assign({}, ...props.map(prop => ({[prop]: item[prop]})));
}