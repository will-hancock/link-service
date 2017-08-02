import Config from './common';

const DEFAULT_MAX_AGE = 10 * 60 * 60 * 24;

export default class LiveConfig extends Config {

    public baseUrl = 'http://$serviceName.live.aws.assertis';

    public proxies = {
        '^\/station\/.+': {
            name: 'ride-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 4000},
        },
        '^\/ticket-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 500},
        },
        '^\/validity-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 100},
        },
        '^\/restriction\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 500},
        },
        '^\/route\/[0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 200},
        },
        '^\/railcard\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 20},
        },
        '^\/supplement-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 200},
        },
        '^\/delivery\/[a-zA-Z\-]+': {
            name: 'delivery-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 200},
        },
        '^\/discount\/[0-9]+': {
            name: 'discount-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 200},
        },
        '^\/sundry-type\/[0-9a-zA-Z]+': {
            name: 'sundry-service',
            cacheConfig: {maxAge: DEFAULT_MAX_AGE, max: 20},
        },
    };

}
