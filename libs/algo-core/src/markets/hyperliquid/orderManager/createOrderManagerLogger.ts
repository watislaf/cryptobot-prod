import {
  CreateOrderRequestHL,
  EditOrderRequestHL,
  OrderBasic,
  OrderHL,
} from '@arbitrage/algo-core';
import { LoggerFactory } from '@arbitrage/logger';
import {
  Amount,
  ClientOrderId,
  OrderId,
  OrderStatus,
} from '@arbitrage/algo-types';
import { SHOW_MORE_LOGS } from '@arbitrage/env';

export const debugInfo = (coid: string, id?: string) =>
  SHOW_MORE_LOGS ? `${id ? `ID: ${id} ` : ''}COID: ${coid}` : '';

export const createOrderManagerLogger = (loggerFactory: LoggerFactory) => {
  const logger = loggerFactory('OrderManager');

  const orderCreated = ({
    params: { clientOrderId },
    side,
    amount,
    price,
  }: CreateOrderRequestHL) =>
    logger.info(
      `Create order | Price ${price} Amount: ${amount} Side: ${side} ${debugInfo(
        clientOrderId
      )}`
    );
  const log = (str: string) => logger.info(str);

  const orderEdited = (
    { coid, id, side }: OrderHL,
    request: Partial<EditOrderRequestHL>
  ) =>
    logger.info(
      `Order edited on Side: ${side} ${
        request.price ? `| New Price: ${request.price}` : ''
      }. ${
        request.amount ? `| New Amount: ${request.amount}` : ''
      }  ${debugInfo(coid, id)}`
    );

  const orderEvent = ({
    status,
    order: { coid, price, amount, id, filled },
  }: {
    order: OrderHL;
    status: OrderStatus;
  }) =>
    SHOW_MORE_LOGS &&
    logger.debug(
      `Received update | New Price: ${price}, New Amount: ${amount}, filled ${filled} ${debugInfo(
        coid,
        id
      )} ${status}`
    );

  const orderIsFilled = ({ id }: OrderBasic, filledAmount: Amount) =>
    logger.info(
      `Order filled | Filled Amount: ${filledAmount} ${debugInfo(id)}`
    );

  const orderUpdateFailed = (error: any, coid: ClientOrderId, id?: OrderId) =>
    logger.warn(error, `Failed to update order. ${debugInfo(coid, id)}`);

  return {
    orderCreated,
    orderEdited,
    orderEvent,
    orderIsFilled,
    log,
    orderUpdateFailed,
  };
};
