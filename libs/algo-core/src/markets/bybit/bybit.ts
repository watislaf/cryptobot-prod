import {
  MarketInfo,
  MarketInfoValue,
  MarketName,
  SymbolBasic,
  SymbolBB,
} from '@arbitrage/algo-types';
import { createApiLoggerFactory } from '@arbitrage/logger';
import {
  apiBB,
  BidAndAskSupplier,
  createBidAndAskSupplierBB,
  createHealthCheckerBB,
  createPositionCreatorBB,
  createTokenCleanerBB,
  CurrentBalanceProvider,
  HealthChecker,
  PositionCreator,
  TokenCleaner,
} from '@arbitrage/algo-core';

const name = MarketName.ByBit;

export const createBbDriver = (
  symbolBasic: SymbolBasic
): BidAndAskSupplier &
  PositionCreator &
  TokenCleaner &
  CurrentBalanceProvider &
  HealthChecker &
  MarketInfoValue => {
  const info = MarketInfo[MarketName.ByBit];
  const symbol = info.symbols[symbolBasic] as SymbolBB;
  const loggerFactory = createApiLoggerFactory(name, symbol);

  return {
    getAvailableBalance: apiBB.getAvailableBalance,
    ...createBidAndAskSupplierBB(apiBB, symbol, loggerFactory),
    ...createPositionCreatorBB(apiBB, symbol, loggerFactory),
    ...createTokenCleanerBB(apiBB, symbol, loggerFactory),
    ...createHealthCheckerBB(apiBB, symbol, loggerFactory),
    ...info,
  };
};
