import { OrderBasic } from '@arbitrage/algo-core';
import { ClientOrderId } from '@arbitrage/algo-types';

export type OrderHL = {
  coid: ClientOrderId;
} & OrderBasic;
