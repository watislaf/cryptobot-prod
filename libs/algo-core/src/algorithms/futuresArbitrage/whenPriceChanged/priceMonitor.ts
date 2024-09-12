import {
  AlgoArgs,
  AlgoOptions,
  and,
  executeWithAbort,
  getReliablePriceFromStable,
  isBuy,
  isFilled,
  isSell,
  not,
  percentDiff,
  PriceInfo,
  UnstableDex,
  wasAborted,
} from '@arbitrage/algo-core';
import { Percent, Price } from '@arbitrage/algo-types';

export const monitorAndRefreshOrderPrices = async (
  { unstableDex, stableDex }: AlgoArgs,
  options: AlgoOptions,
  isActive: () => boolean
): Promise<void> => {
  const { stalePriceThreshold, spreadAdjustment } = options;

  while (isActive()) {
    const priceInfo = await executeWithAbort(
      () => getReliablePriceFromStable(stableDex, spreadAdjustment),
      () => !isActive()
    );
    if (wasAborted(priceInfo)) return;

    await updateOrdersIfStaleAndNotFilled(
      unstableDex,
      priceInfo,
      stalePriceThreshold
    );
  }
};
const updateOrdersIfStaleAndNotFilled = async (
  unstableDex: UnstableDex,
  priceInfo: PriceInfo,
  stalePriceThreshold: Percent
): Promise<void> => {
  const { buyPrice, sellPrice } = priceInfo;
  const buyCondition = and(
    isBuy,
    isPriceStale(buyPrice, stalePriceThreshold),
    not(isFilled)
  );
  const sellCondition = and(
    isSell,
    isPriceStale(sellPrice, stalePriceThreshold),
    not(isFilled)
  );

  await Promise.all([
    unstableDex.updateOrders(buyCondition, { price: buyPrice }),
    unstableDex.updateOrders(sellCondition, { price: sellPrice }),
  ]);
};

export const isPriceStale =
  (currentPrice: Price, threshold: Percent) =>
  ({ price }: { price: Price }) =>
    percentDiff(price, currentPrice) > threshold;
