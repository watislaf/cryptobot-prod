import { Amount, PositionSide } from '@arbitrage/algo-types';
import { LoggerFactory } from '@arbitrage/logger';
import { SHOW_MORE_LOGS } from '@arbitrage/env';

export const createTokenCleanerLogger = (loggerFactory: LoggerFactory) => {
  const logger = loggerFactory('TokenCleaner');
  return {
    noOrdersToCancel: () =>
      SHOW_MORE_LOGS && logger.info('No orders to cancel.'),
    noPositionToClose: () =>
      SHOW_MORE_LOGS && logger.info('No position to close.'),
    positionClosed: (amount: Amount, side: PositionSide) =>
      logger.info(
        `Preparation... Position closed with amount ${amount} on side ${side}`
      ),
    ordersClosed: (amounts: Amount[]) =>
      logger.info(`Preparation... Closed all orders with amount: ${amounts}.`),
    cleaned: () =>
      logger.info(
        'Preparation completed. All orders and positions on that token closed.'
      ),
  };
};

export type TokenCleanerLogger = ReturnType<typeof createTokenCleanerLogger>;
