import { createOrderError, OrderErrorType } from '@arbitrage/algo-core';

export const parseBBOrderError = (info: { msg: string }, meta: any) => {
  const message = info.msg;

  if (message.includes('ab not enough for new order')) {
    return createOrderError(
      OrderErrorType.InsufficientMargin,
      { meta },
      `Insufficient margin: ${message}`
    );
  }

  return createOrderError(
    OrderErrorType.Unknown,
    { meta },
    `Unknown error: ${message}`
  );
};
