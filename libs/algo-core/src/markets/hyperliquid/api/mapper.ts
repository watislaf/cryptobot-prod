import {
  CreateOrderRequestHL,
  createSuccess,
  isOrderInfoFilled,
  OrderHL,
  parseHlOrderError,
  unique128bit,
} from '@arbitrage/algo-core';
import {
  Amount,
  ClientOrderId,
  OrderId,
  OrderSide,
  OrderStatus,
  OrderType,
  Price,
  SymbolHL,
} from '@arbitrage/algo-types';
import { SHOW_MORE_LOGS } from '@arbitrage/env';
import { Order } from 'ccxt/js/src/base/types';

export const toHlCreateOrderRequest = ({
  amount,
  side,
  price,
  symbol,
  params,
}: {
  amount: Amount;
  side: OrderSide;
  price: Price;
  symbol: SymbolHL;
  params?: {
    reduceOnly?: boolean;
    type?: OrderType;
    coid?: ClientOrderId;
  };
}): CreateOrderRequestHL => ({
  symbol,
  side,
  price,
  amount,
  type: params?.type || OrderType.Limit,
  params: {
    reduceOnly: params?.reduceOnly,
    clientOrderId: params?.coid || (unique128bit() as ClientOrderId),
  },
});

export const parseCreateOrderResponse = (
  order: Order,
  request: CreateOrderRequestHL
) => {
  const { amount, side, price } = request;
  const coid = request.params.clientOrderId;

  if (!order.id) {
    return parseHlOrderError(order.info, request);
  }

  const filledOnCreated = isOrderInfoFilled(order.info)
    ? Number(order.info.filled.totalSz)
    : 0;

  return createSuccess({
    id: order.id as OrderId,
    coid,
    price,
    amount,
    side,
    filled: filledOnCreated as Amount,
  });
};
export const parseUpdateOrderResponse = (
  order: Order,
  price: Price,
  amount: Amount,
  orderToUpdate: OrderHL
) => {
  if (!order.id) {
    return parseHlOrderError(order.info, { price, amount });
  }
  const filledOnUpdate = isOrderInfoFilled(order.info)
    ? Number(order.info.filled.totalSz)
    : 0;

  return createSuccess({
    ...orderToUpdate,
    price,
    amount,
    id: order.id as OrderId,
    filled:
      filledOnUpdate > 0 ? (filledOnUpdate as Amount) : orderToUpdate.filled,
  });
};

export const parseOrderUpdate = (order: Order) => {
  const { id, side, price, clientOrderId } = order;
  const currentAmount = Number(order.info.order?.sz) ?? 0;
  const originalAmount = Number(order.info.order?.origSz);
  if (order.info.status === 'canceled')
    SHOW_MORE_LOGS && console.debug('CANCELLED ORDER', order.info);
  if (order.info.status === 'open')
    SHOW_MORE_LOGS && console.debug('OPEN ORDER', order.info);
  if (order.info.status === 'filled')
    SHOW_MORE_LOGS && console.debug('FILLED ORDER', order.info);
  return {
    status: order.info.status as OrderStatus,
    order: {
      id: id as OrderId,
      coid: clientOrderId as ClientOrderId,
      price: price as Price,
      amount: originalAmount as Amount,
      side: side as OrderSide,
      filled: (originalAmount - currentAmount) as Amount,
    },
  };
};
