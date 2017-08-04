import Config from './common';

export default class TestConfig extends Config {

    public defaultMaxAge = 60 * 60 * 24;
    public baseUrl = 'http://$serviceName.test.aws.assertis';

}
