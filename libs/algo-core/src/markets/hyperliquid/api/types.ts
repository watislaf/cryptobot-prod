import type {
  Order,
  OrderBook,
  OrderType,
  Position,
} from 'ccxt/js/src/base/types';
import {
  Amount,
  ClientOrderId,
  Dollar,
  OrderId,
  OrderSide,
  OrderStatus,
  Price,
  SymbolHL,
} from '@arbitrage/algo-types';
import {
  EditOrderRequestHL,
  OrderErrorDetails,
  OrderHL,
  WrappedResult,
} from '@arbitrage/algo-core';

export type RestingInfo = { resting: { cloid: ClientOrderId } };
export type FilledInfo = { filled: { cloid: ClientOrderId; totalSz: string } };
export type Info = RestingInfo | FilledInfo;

export const isOrderInfoFilled = (info: Info): info is FilledInfo => {
  return (info as FilledInfo).filled !== undefined;
};

export type CreateOrderRequestHL = {
  symbol: SymbolHL;
  side: OrderSide;
  type: OrderType;
  price: Price;
  amount: Amount;
  params: {
    clientOrderId: ClientOrderId;
    reduceOnly?: boolean;
  };
};

export type ApiHL = {
  editOrder(
    orderToUpdate: OrderHL,
    editOrderRequest: Partial<EditOrderRequestHL>,
    symbol: SymbolHL
  ): Promise<WrappedResult<OrderHL, OrderErrorDetails>>;
  createOrders(
    requests: CreateOrderRequestHL[]
  ): Promise<Array<WrappedResult<OrderHL, OrderErrorDetails>>>;
  getPosition(symbol: SymbolHL): Promise<Position>;
  getOrderBook(symbol: SymbolHL): Promise<OrderBook>;
  watchOrders(symbol: SymbolHL): Promise<HlOrderUpdate[]>;
  getOpenOrders(symbol: SymbolHL): Promise<Order[]>;
  cancelOrders(ids: OrderId[], symbol: SymbolHL): Promise<Order[]>;
  getAvailableBalance(): Promise<Dollar>;
  minOrderValue: Dollar;
};

export type HlOrderUpdate = {
  status: OrderStatus;
  order: OrderHL;
};
