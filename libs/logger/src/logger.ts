import pino, { LogFn, Logger as PinoLogger } from 'pino';
import { AlgoEventType, getAlgoEventEmitter } from '@arbitrage/logger';

export type Logger = PinoLogger;
export type LoggerFactory = (serviceName: string) => Logger;

export const createApiLoggerFactory = (name: string, symbol: string) => () =>
  createLogger(`[${name}/${parseBaseCurrency(symbol)}]`);

export const createLogger = (name: string): Logger => {
  const logger = pino({
    name,
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: true,
        ignore: 'pid,hostname',
      },
    },
  });

  const logLevels: Array<keyof PinoLogger> = [
    'info',
    'warn',
    'error',
    'fatal',
    'debug',
    'trace',
  ];

  return new Proxy(logger, {
    get(target, prop: keyof PinoLogger) {
      if (typeof target[prop] === 'function' && logLevels.includes(prop)) {
        return (...args: Parameters<LogFn>) => {
          (target[prop] as LogFn)(...args);
          getAlgoEventEmitter().emit({
            eventType: AlgoEventType.LOG,
            logType: prop,
            message: `${name}:` + args.map((v) => JSON.stringify(v)).join('|'),
          });
        };
      }
      return target[prop];
    },
  });
};

export const parseBaseCurrency = (pair: string): string => {
  const match = pair.match(/^(\w+)(\/\w+)?(:\w+)?$/);
  if (match) {
    return match[1];
  }
  throw new Error('Invalid pair format');
};
