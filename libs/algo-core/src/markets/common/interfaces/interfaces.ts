import { OrderErrorDetails, WrappedResult } from '@arbitrage/algo-core';
import { Amount, Dollar, PositionSide } from '@arbitrage/algo-types';
import { Order } from 'ccxt/js/src/base/types';

export type PositionCreator = {
  openPosition: (
    side: PositionSide,
    amount: Amount
  ) => Promise<WrappedResult<Order, OrderErrorDetails>[]>;
};

export type CurrentBalanceProvider = {
  getAvailableBalance: () => Promise<Dollar>;
};
