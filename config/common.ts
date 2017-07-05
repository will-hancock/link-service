const DEFAULT_MAX_AGE = 1000 * 60; // 60 seconds

export interface CacheConfigItem {
    maxAge: number;
    max: number;
}

export type CacheConfig = {
    [key: string]: CacheConfigItem;
};

export interface ProxyConfigItem {
    name: string;
    cacheConfig: CacheConfig;
}

export type ProxyConfig = {
    [uriRegex: string]: ProxyConfigItem;
};

export default class Config {

    public baseUrl = 'http://$serviceName.local';
    public koaPort = 9000;

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
    };

}


