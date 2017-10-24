import Config from './common';

export default class SidConfig extends Config {

    public defaultMaxAge = 1000 * 60;
    public baseUrl = 'http://$serviceName.local';

}
