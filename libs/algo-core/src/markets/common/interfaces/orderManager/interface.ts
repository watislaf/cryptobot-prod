import {
  CreateOrderRequest,
  OnFilled,
  OrderBasic,
  OrderBasicFilter,
  OrderErrorDetails,
  OrderHL,
  OrderUpdateSupplier,
  WrappedResult,
} from '@arbitrage/algo-core';

type CreateOrdersResult = Array<WrappedResult<OrderBasic, OrderErrorDetails>>;

export type OrderManagerInterface = {
  createOrders(
    ...createOrderRequests: CreateOrderRequest[]
  ): Promise<CreateOrdersResult>;
  updateOrders(
    filter: OrderBasicFilter,
    update: OrderUpdateSupplier
  ): Promise<WrappedResult<OrderHL, OrderErrorDetails>[]>;
  runOrderManager(onFilled: OnFilled, isActive: () => boolean): Promise<void>;
};
