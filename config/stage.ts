
import Config from './common';

export default class StageConfig extends Config {

    public defaultMaxAge = 60 * 60 * 24;
    public baseUrl = 'http://$serviceName.stage.aws.assertis';
}
