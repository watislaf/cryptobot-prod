import { Status, WrappedError } from '@arbitrage/algo-core';
import { Dollar } from '@arbitrage/algo-types';

export enum OrderErrorType {
  MinValue = 'MinValue',
  Unknown = 'Unknown',
  InsufficientMargin = 'InsufficientMargin',
  OrderDoesNotExist = 'OrderDoesNotExist',
  NotInitialized = 'NotInitialized',
}

export type OrderErrorMap = {
  [OrderErrorType.MinValue]: OrderErrorMinValue;
  [OrderErrorType.Unknown]: { meta?: any };
  [OrderErrorType.InsufficientMargin]: { meta?: any };
  [OrderErrorType.OrderDoesNotExist]: undefined;
  [OrderErrorType.NotInitialized]: undefined;
};

type OrderErrorMinValue = {
  dollarValue: Dollar;
  minDollarValue: Dollar;
};

export type OrderErrorDetails = {
  type: OrderErrorType;
  data: OrderErrorMap[OrderErrorType];
  stack: string;
  message: string;
};

export const createOrderError = <T extends OrderErrorType>(
  type: T,
  data: OrderErrorMap[T],
  message: string
): WrappedError<OrderErrorDetails> => ({
  status: Status.Error,
  error: {
    type,
    data,
    stack: new Error().stack || '',
    message,
  },
});

// export const getOrderErrorData = ({
//   error: { type, data },
// }: WrappedError<OrderErrorDetails<>>): OrderErrorMap[typeof type] => {
//   switch (type) {
//     case OrderErrorType.MinValue:
//       return data
//     default:
//       throw new Error(`Unknown error type: ${type}`)
//   }
// }
