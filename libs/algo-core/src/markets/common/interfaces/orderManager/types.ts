import { Filter, UpdateSupplier } from '@arbitrage/algo-core';
import { Amount, ClientOrderId, OrderId, OrderSide, Price } from '@arbitrage/algo-types';

export type OrderBasic = {
  id: OrderId;
  price: Price;
  side: OrderSide;
  amount: Amount;
  filled: Amount;
};

export type OrderBasicFilter = Filter<OrderBasic>;

export type OrderUpdateSupplier = UpdateSupplier<
  OrderBasic,
  Partial<EditOrderRequestHL>
>;

export type CreateOrderRequest = {
  amount: Amount;
  side: OrderSide;
  price: Price;
  params?: { coid?: ClientOrderId };
};

export type EditOrderRequestHL = { amount: Amount; price: Price };

export type OnFilled = (
  order: OrderBasic,
  filledDifference: Amount
) => Promise<any> | any;
