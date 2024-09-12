import { createSuccess, parseBBOrderError } from '@arbitrage/algo-core';
import { Order } from 'ccxt/js/src/base/types';

export const parseOrderResponse = (order: Order, meta: any) => {
  if (!order.id) {
    return parseBBOrderError(order.info, meta);
  }
  return createSuccess(order);
};
