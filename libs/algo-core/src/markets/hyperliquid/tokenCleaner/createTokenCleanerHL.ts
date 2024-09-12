import { LoggerFactory } from '@arbitrage/logger';
import {
  Amount,
  BidAndAsk,
  OrderId,
  OrderType,
  PositionSide,
  Price,
  SymbolHL,
  TEN_PERCENTS,
} from '@arbitrage/algo-types';
import {
  ApiHL,
  cleanOrders,
  cleanPositionsUsingReducerOrder,
  createTokenCleanerLogger,
  extractBidAndAsk,
  forSide,
  opposite,
  toHlCreateOrderRequest,
  toOrderSide,
  withExpandedSpread,
} from '@arbitrage/algo-core';

export const createTokenCleanerHL = (
  api: ApiHL,
  symbol: SymbolHL,
  loggerFactory: LoggerFactory
) => {
  const logger = createTokenCleanerLogger(loggerFactory);

  const openOrdersSupplier = async () => api.getOpenOrders(symbol);

  const cancelOrders = async (orderIds: OrderId[]) => {
    await api.cancelOrders(orderIds, symbol);
  };

  const createClosingPositionOrder = async (
    positionAmount: Amount,
    side: PositionSide,
    bidAndAsk: BidAndAsk
  ) => {
    const oppositeOrderSide = opposite(toOrderSide(side));
    const marketOrderPrice = forSide(
      withExpandedSpread(bidAndAsk, TEN_PERCENTS),
      toOrderSide(side)
    );

    await api.createOrders([
      toHlCreateOrderRequest({
        amount: positionAmount,
        side: oppositeOrderSide,
        price: marketOrderPrice as Price,
        symbol,
        params: {
          type: OrderType.Market,
          reduceOnly: true,
        },
      }),
    ]);
  };
  const cleanPositions = async () => {
    const [position, orderBook] = await Promise.all([
      api.getPosition(symbol),
      api.getOrderBook(symbol),
    ]);

    const bidAndAsk = extractBidAndAsk(orderBook)!;
    const createReduceOrderFn = (amount: Amount, side: PositionSide) =>
      createClosingPositionOrder(amount, side, bidAndAsk);

    if (!position.contracts) return;

    await cleanPositionsUsingReducerOrder(
      {
        amount: Math.abs(position.contracts) as Amount,
        side: position.contracts > 0 ? PositionSide.Long : PositionSide.Short,
      },
      createReduceOrderFn,
      logger
    );
  };

  const cleanOrdersAndPositions = async () => {
    await Promise.all([
      cleanOrders(openOrdersSupplier, cancelOrders, logger),
      cleanPositions(),
    ]);
    logger.cleaned();
  };

  return {
    cleanOrdersAndPositions,
  };
};
