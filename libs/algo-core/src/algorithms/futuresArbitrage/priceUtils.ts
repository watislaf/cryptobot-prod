import { StableDex, withExpandedSpread } from '@arbitrage/algo-core';
import { Percent, Price } from '@arbitrage/algo-types';

export const getReliablePriceFromStable = async (
  stableDex: StableDex,
  spreadAdjustment: Percent,
  instantly?: boolean
) => {
  const { bid, ask } = withExpandedSpread(
    await stableDex.getBidAndAsk(instantly),
    spreadAdjustment
  );
  return { buyPrice: bid as Price, sellPrice: ask as Price };
};

export type PriceInfo = { buyPrice: Price; sellPrice: Price };

export type BuyAndSellPrice = { buyPrice: Price; sellPrice: Price };
