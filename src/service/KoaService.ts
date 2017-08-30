import * as Koa from 'koa';
import {Context} from 'koa';
import * as compress from 'koa-compress';
import * as responseTime from 'koa-response-time';
import {StatusCodeError} from 'request-promise/errors';
import {CachedHttpClient, Request} from '../http/CachedHttpClient';
import {Logger} from '../logger/Logger';

export default class KoaService {

    private static readonly VALID_HEADERS = [
        'x-access-token', 'x-auth-token', 'x-env', 'x-tenant', 'user-agent', 'accept', 'accept-encoding'
    ];

    constructor(private readonly httpClient: CachedHttpClient,
                private readonly logger: Logger,
                private readonly koaPort: number) {
    }

    /**
     * Start the koa server
     */
    public start(): void {
        const app = new Koa();

        app.use(responseTime());
        app.use(compress());
        app.use(this.handler.bind(this));

        app.listen(this.koaPort);
        this.logger.info(`Service started on ${this.koaPort}`);
    }

    /**
     * Handle journey planning requests.
     */
    private async handler(ctx: Context) {
        if (ctx.request.path !== '/resolve') {
            return;
        }

        try {
            ctx.body = await this.httpClient.get(KoaService.buildRequest(ctx));
        }
        catch (err) {
            if (err instanceof StatusCodeError) {
                this.logger.info(err);

                ctx.body = err.error;
                ctx.response.status = err.statusCode;
            }
            else {
                this.logger.error(err);

                ctx.body = err.message;
                ctx.response.status = 500;
            }
        }
    }

    /**
     * Use the Koa Context to create a Request object
     */
    public static buildRequest(ctx: Context): Request {
        return {
            links: JSON.parse(ctx.request.query.links),
            blacklist: ctx.request.query.blacklist ? JSON.parse(ctx.request.query.blacklist) : [],
            headers: pick(ctx.headers, KoaService.VALID_HEADERS)
        };
    }

}

function pick(item: object, props: string[]) {
    return Object.assign({}, ...props.map(prop => ({[prop]: item[prop]})));
}