
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

export default abstract class Config {

    public abstract defaultMaxAge;
    public abstract baseUrl;
    public koaPort = 9000;

    public proxies = {
        '^\/station\/.+': {
            name: 'ride-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 4000 }
        },
        '^\/ticket-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 500 }
        },
        '^\/validity-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 100 }
        },
        '^\/restriction\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 500 }
        },
        '^\/route\/[0-9]+': {
            name: 'ride-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 200 }
        },
        '^\/railcard\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 20 }
        },
        '^\/supplement-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 200 }
        },
        '^\/delivery\/[a-zA-Z\-]+': {
            name: 'delivery-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 200 }
        },
        '^\/discount\/[0-9]+': {
            name: 'discount-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 200 }
        },
        '^\/paypal\/[0-9]+': {
            name: 'paypal-service',
            cacheConfig: { maxAge: 0, max: 0 }
        },
        '\/payment\/[0-9]+': {
            name: 'order-service',
            cacheConfig: { maxAge: 0, max: 0 }
        },
        '\/order\/[0-9]+': {
            name: 'order-service',
            cacheConfig: { maxAge: 0, max: 0 }
        },
        '\/address\/[0-9]+': {
            name: 'customer-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 0 }
        },
        '\/customer\/[0-9]+': {
            name: 'customer-service',
            cacheConfig: { maxAge: this.defaultMaxAge, max: 0 }
        }
    };

}


