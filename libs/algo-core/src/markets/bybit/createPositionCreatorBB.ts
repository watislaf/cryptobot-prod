import { ApiBB, PositionCreator, toOrderSide } from '@arbitrage/algo-core';
import { Amount, OrderType, PositionSide, SymbolBB } from '@arbitrage/algo-types';
import { LoggerFactory } from '@arbitrage/logger';

export const createPositionCreatorBB = (
  api: ApiBB,
  symbol: SymbolBB,
  loggerFactory: LoggerFactory
): PositionCreator => {
  const logger = loggerFactory('PositionCreator');

  const openPosition = async (side: PositionSide, amount: Amount) => {
    logger.info(`Open position | Amount ${amount} Side ${side}`);
    return await api.createOrders([
      { symbol, type: OrderType.Market, side: toOrderSide(side), amount },
    ]);
  };

  return {
    openPosition,
  };
};
