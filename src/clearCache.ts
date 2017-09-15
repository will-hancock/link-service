import { Container } from './service/Container';
import { Proxy } from './proxy/Proxy';

const uri = process.argv[2];
const container = new Container();
container.getLogger().info(`Start clearing cache from ${uri}`);
container.getProxies().forEach((proxy: Proxy) => proxy.del(uri));
