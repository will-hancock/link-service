import * as pino from 'pino';

export const loggerStub = pino({name: 'link-service-mock', level: 'silent'});
