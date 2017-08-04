
import Config from './common';

export default class LiveConfig extends Config {

    public defaultMaxAge = 60 * 60 * 24;
    public baseUrl = 'http://$serviceName.live.aws.assertis';

}
