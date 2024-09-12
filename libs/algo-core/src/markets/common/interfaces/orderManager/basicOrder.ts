import { OrderBasicFilter } from '@arbitrage/algo-core';
import { OrderSide } from '@arbitrage/algo-types';

export const isBuy: OrderBasicFilter = (order) => order.side === OrderSide.Buy;

export const isSell: OrderBasicFilter = (order) =>
  order.side === OrderSide.Sell;

export const isFilled: OrderBasicFilter = (order) =>
  order.filled === order.amount;

export const hasSide =
  (side: OrderSide): OrderBasicFilter =>
  (order) =>
    order.side === side;

export const opposite = (side: OrderSide) =>
  side === OrderSide.Sell ? OrderSide.Buy : OrderSide.Sell;
