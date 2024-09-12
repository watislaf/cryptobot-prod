import { OrderErrorDetails, WrappedResult } from '@arbitrage/algo-core';
import {
  Amount,
  Dollar,
  OrderId,
  OrderSide,
  OrderType,
  Price, SymbolBB
} from '@arbitrage/algo-types';
import { Order, OrderBook, Position } from 'ccxt/js/src/base/types';

export type BBCreateOrderRequest =
  | {
      symbol: SymbolBB;
      side: OrderSide;
      type: OrderType.Limit;
      price: Price;
      amount: Amount;
      params?: {
        reduceOnly?: boolean;
      };
    }
  | {
      symbol: SymbolBB;
      side: OrderSide;
      type: OrderType.Market;
      amount: Amount;
      params?: {
        reduceOnly?: boolean;
      };
    };

export type ApiBB = {
  getOrderBook: (symbol: SymbolBB) => Promise<OrderBook>;
  createOrders(
    requests: BBCreateOrderRequest[]
  ): Promise<Array<WrappedResult<Order, OrderErrorDetails>>>;
  cancelOrders: (ids: OrderId[], symbol: SymbolBB) => Promise<any>;
  getOpenOrders: (symbol: SymbolBB) => Promise<Order[]>;
  getPosition: (symbol: SymbolBB) => Promise<Position>;
  minOrderValue: Dollar;
  getAvailableBalance: () => Promise<Dollar>;
};
