import {
  apiHL,
  createHealthCheckerHL,
  createOrderManagerHL,
  createTokenCleanerHL,
  CurrentBalanceProvider,
  HealthChecker,
  OrderManagerInterface,
  TokenCleaner,
} from '@arbitrage/algo-core';
import { createApiLoggerFactory } from '@arbitrage/logger';
import {
  MarketInfo,
  MarketInfoValue,
  MarketName,
  SymbolBasic,
  SymbolHL,
} from '@arbitrage/algo-types';

const name = MarketName.HyperLiquid;

export const createHlDriver = (
  symbolBasic: SymbolBasic
): OrderManagerInterface &
  TokenCleaner &
  CurrentBalanceProvider &
  HealthChecker &
  MarketInfoValue => {
  const info = MarketInfo[MarketName.HyperLiquid];
  const symbol = info.symbols[symbolBasic] as SymbolHL;
  const loggerFactory = createApiLoggerFactory(name, symbol);

  return {
    ...createOrderManagerHL(apiHL, symbol, loggerFactory),
    ...createTokenCleanerHL(apiHL, symbol, loggerFactory),
    ...createHealthCheckerHL(apiHL, symbol, loggerFactory),
    ...info,
    getAvailableBalance: apiHL.getAvailableBalance,
  };
};
