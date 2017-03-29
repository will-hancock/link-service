import * as pino from 'pino';

export const loggerStub = pino({name: 'molecule-service-mock', level: 'silent'});
