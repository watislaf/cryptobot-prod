import { createOrderError, OrderErrorType } from '@arbitrage/algo-core';
import { Amount, Dollar, Price } from '@arbitrage/algo-types';

const parseHlOrderErrorMessage = (
  message: any,
  metadata: { amount: Amount; price: Price }
) => {
  if (message?.includes('Order must have minimum value of')) {
    const minDollarValueMatch = message.match(
      /Order must have minimum value of \$([0-9.]+)/
    );
    const minDollarValue = minDollarValueMatch
      ? parseFloat(minDollarValueMatch[1])
      : null;

    if (minDollarValue !== null) {
      return createOrderError(
        OrderErrorType.MinValue,
        {
          dollarValue: (metadata.amount * metadata.price) as Dollar,
          minDollarValue: minDollarValue as Dollar,
        },
        `Order value is less than the minimum required value: ${
          metadata.amount * metadata.price
        }$ < ${minDollarValue}$`
      );
    }
  }

  if (message?.includes('Insufficient margin to place order')) {
    return createOrderError(
      OrderErrorType.InsufficientMargin,
      {
        meta: metadata,
      },
      `Insufficient margin: ${message}`
    );
  }

  return createOrderError(
    OrderErrorType.Unknown,
    {
      meta: metadata,
    },
    `Unknown error: ${message}`
  );
};

export const parseHlOrderError = (
  errorObj: any,
  metadata: { amount: Amount; price: Price }
) => {
  if (typeof errorObj === 'string') {
    return parseHlOrderErrorMessage(errorObj, metadata);
  }

  if (typeof errorObj?.error === 'string') {
    return parseHlOrderErrorMessage(errorObj.error, metadata);
  }

  if (errorObj instanceof Error) {
    return parseHlOrderErrorMessage(errorObj.message, metadata);
  }

  return parseHlOrderErrorMessage('Unknown error', metadata);
};
