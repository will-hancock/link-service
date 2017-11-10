
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
            cacheConfig: {maxAge: this.defaultMaxAge, max: 4000}
        },
        '^\/ticket-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 500}
        },
        '^\/validity-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 100}
        },
        '^\/restriction\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 500}
        },
        '^\/route\/[0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 200}
        },
        '^\/railcard\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 20}
        },
        '^\/supplement-type\/[a-zA-Z0-9]+': {
            name: 'ride-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 200}
        },
        '^\/delivery\/[a-zA-Z\-]+': {
            name: 'delivery-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 200}
        },
        '^\/discount\/[0-9]+': {
            name: 'discount-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 200}
        },
        '^\/sundry-type\/[0-9a-zA-Z]+': {
            name: 'sundry-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 20}
        },
        '^\/paypal\/[0-9]+': {
            name: 'paypal-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/payment\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/order\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/trip\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/journey\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/ticket\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/supplement\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/card-payment\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/fare\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/leg\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/reservation\/[A-Za-z0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/seat-reservation\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/sundry\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/sundry-type\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/toc\/[A-Za-z0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/voucher-payment\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/warrant-payment\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/service\/[A-Za-z0-9]+\/[0-9]{4}\-[0-9]{2}\-[0-9]{2}': {
            name: 'order-service',
            cacheConfig: {maxAge: 1, max: 0}
        },
        '\/address\/[0-9]+': {
            name: 'customer-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 0}
        },
        '\/customer\/[0-9]+': {
            name: 'customer-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 0}
        },
        '\/passenger\/[0-9]+': {
            name: 'order-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 1000}
        },
        '\/paypal\/[0-9]+': {
            name: 'paypal-service',
            cacheConfig: {maxAge: this.defaultMaxAge, max: 0}
        }
    };

}


