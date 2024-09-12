import { BuyAndSellPrice, hasSide, isSuccess, StableDex, throwOnError, UnstableDex } from '@arbitrage/algo-core';
import { Amount, OrderSide, PositionSide } from '@arbitrage/algo-types';

import { Logger } from '@arbitrage/logger';

export const addSizeToAnOrderOnUnstable = async (
  unstableDex: UnstableDex,
  side: OrderSide,
  additional: Amount,
  getReliablePrice: () => Promise<BuyAndSellPrice>,
  logger: Logger
) => {
  logger.info(`Adding ${additional} to ${side} order`);
  const updatedOrders = await unstableDex.updateOrders(
    hasSide(side),
    ({ amount: old }) => ({
      amount: (old + additional) as Amount,
    })
  );
  if (!updatedOrders.some(isSuccess)) {
    logger.info(`No order on ${side}. Creating new one.`);
    const { buyPrice, sellPrice } = await getReliablePrice();
    const price = side === OrderSide.Sell ? sellPrice : buyPrice;
    (await unstableDex.createOrders({ amount: additional, side, price })).map(
      throwOnError
    );
  }
};

export const openPositionOnStable = async (
  stableDex: StableDex,
  side: PositionSide,
  additional: Amount
) => {
  (await stableDex.openPosition(side, additional)).map(throwOnError);
};
