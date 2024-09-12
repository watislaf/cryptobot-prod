import { WrappedSuccess } from "@arbitrage/algo-core";

export enum Status {
  Success = 'success',
  Error = 'error',
}

export type WrappedError<E> = {
  status: Status.Error;
  error: E;
};

export type WrappedResult<Order, OrderError> =
  | WrappedSuccess<Order>
  | WrappedError<OrderError>;

export const isError = <Success, Error>(
  result: WrappedResult<Success, Error>
): result is WrappedError<Error> => result.status === Status.Error;

export const isSuccess = <Success, Error>(
  result: WrappedResult<Success, Error>
): result is WrappedSuccess<Success> => result.status === Status.Success;

export const throwOnError = <Success, Error>(
  result: WrappedResult<Success, Error>
): Success => {
  if (isError(result)) {
    throw result.error;
  }
  return result.data;
};
