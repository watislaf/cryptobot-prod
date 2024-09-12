import { Status } from "@arbitrage/algo-core";

export type WrappedSuccess<T> = {
  status: Status.Success;
  data: T;
};

export const createSuccess = <T>(data: T): WrappedSuccess<T> =>
  ({
    status: Status.Success,
    data,
  } as const);
