import {
  BidAndAskSupplier,
  CurrentBalanceProvider,
  HealthChecker,
  OrderManagerInterface,
  PositionCreator,
  TokenCleaner,
} from '@arbitrage/algo-core';
import { Amount, MarketInfoValue, Percent } from '@arbitrage/algo-types';

export type StableDex = BidAndAskSupplier &
  PositionCreator &
  TokenCleaner &
  CurrentBalanceProvider &
  HealthChecker &
  MarketInfoValue;

export type UnstableDex = OrderManagerInterface &
  TokenCleaner &
  CurrentBalanceProvider &
  HealthChecker &
  MarketInfoValue;

export type AlgoArgs = {
  stableDex: StableDex;
  unstableDex: UnstableDex;
};

export type AlgoOptions = {
  spreadAdjustment: Percent;
  stalePriceThreshold: Percent;
  availableTokens: Amount;
};
