import {
  ApiBB,
  cleanOrders,
  cleanPositionsUsingReducerOrder,
  createTokenCleanerLogger,
  opposite,
  toOrderSide,
} from '@arbitrage/algo-core';
import {
  Amount,
  OrderId,
  OrderType,
  PositionSide,
  SymbolBB,
} from '@arbitrage/algo-types';
import { LoggerFactory } from '@arbitrage/logger';
import { Position } from 'ccxt/js/src/base/types';

export const createTokenCleanerBB = (
  api: ApiBB,
  symbol: SymbolBB,
  loggerFactory: LoggerFactory
) => {
  const logger = createTokenCleanerLogger(loggerFactory);

  const openOrdersSupplier = async () => api.getOpenOrders(symbol);

  const cancelOrders = async (orderIds: OrderId[]) => {
    await api.cancelOrders(orderIds, symbol);
  };

  const createClosingPositionOrder = async (
    positionAmount: Amount,
    positionSide: PositionSide
  ) => {
    const oppositeOrderSide = opposite(toOrderSide(positionSide));
    await api.createOrders([
      {
        amount: Math.abs(positionAmount) as Amount,
        side: oppositeOrderSide,
        symbol,
        type: OrderType.Market,
        params: {
          reduceOnly: true,
        },
      },
    ]);
  };

  const cleanPosition = (position: Position) => {
    if (!position.contracts) return;
    return cleanPositionsUsingReducerOrder(
      {
        amount: position.contracts as Amount,
        side: position.side as PositionSide,
      },
      createClosingPositionOrder,
      logger
    );
  };

  const cleanOrdersAndPositions = async () => {
    const position = await api.getPosition(symbol);
    await Promise.all([
      cleanOrders(openOrdersSupplier, cancelOrders, logger),
      cleanPosition(position),
    ]);
    logger.cleaned();
  };

  return {
    cleanOrdersAndPositions,
  };
};
