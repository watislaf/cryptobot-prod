import {
  Amount,
  OrderSide,
  Percent,
  PositionAmount,
  TEN_PERCENTS,
} from '@arbitrage/algo-types';
import {
  addSizeToAnOrderOnUnstable,
  AlgoArgs,
  AlgoOptions,
  getReliablePriceFromStable,
  OnFilled,
  openPositionOnStable,
  OrderBasic,
  StableDex,
  toPositionSide,
  UnstableDex,
  withExpandedSpread,
} from '@arbitrage/algo-core';
import { Logger } from '@arbitrage/logger';
import { SHOW_MORE_LOGS } from '@arbitrage/env';

export interface Memory {
  filledOrdersSize: PositionAmount;
  savedFilledOrderSize: PositionAmount;
}

export const calculateOrderSizeDifference = (state: Memory): PositionAmount => {
  return (state.filledOrdersSize -
    state.savedFilledOrderSize) as PositionAmount;
};

export const determineNewOrderSide = (
  orderSizeDifference: PositionAmount
): OrderSide => {
  // if we have more buy orders than sell orders, we need to sell
  return orderSizeDifference > 0 ? OrderSide.Sell : OrderSide.Buy;
};

export const updateSavedFilledOrdersSize = (
  state: Memory,
  side: OrderSide,
  filledDifference: Amount
): void => {
  state.filledOrdersSize = (state.filledOrdersSize +
    (side === OrderSide.Buy
      ? filledDifference
      : -filledDifference)) as PositionAmount;
};

// This is very approximate, but it should work for now. I get stable dex price ( assuming that is fetching constantly),
// reduce ask price by 10% and check if this lowered price is still enough to make a trade.
// if not we should not make a trade and wait until size will increase enough to make a trade.
// in the future it is better to split this logic and permit creation of positions independently from orders
async function isDifferenceTooLow(
  stableDex: StableDex,
  unstableDex: UnstableDex,
  absPositionSizeDifference: Amount
) {
  const { ask } = withExpandedSpread(
    await stableDex.getBidAndAsk(true),
    TEN_PERCENTS
  );
  const additionalOrderValue = ask * absPositionSizeDifference;
  return (
    additionalOrderValue <
    Math.max(unstableDex.minOrderValue, stableDex.minOrderValue)
  );
}

export const createWhenOrderIsFilledOpenNewOrders = (
  { unstableDex, stableDex }: AlgoArgs,
  { spreadAdjustment }: AlgoOptions,
  logger: Logger
): OnFilled => {
  let state: Memory = {
    filledOrdersSize: 0 as PositionAmount,
    savedFilledOrderSize: 0 as PositionAmount,
  };

  return async (
    { side, id }: OrderBasic,
    filledDifference: Amount
  ): Promise<void> => {
    SHOW_MORE_LOGS &&
      logger.debug(
        `Since order on side ${side} was filled for Amount ${filledDifference} id ${id} i will adjust positions`
      );

    updateSavedFilledOrdersSize(state, side, filledDifference);

    const orderSizeDifference = calculateOrderSizeDifference(state);
    const absPositionSizeDifference = Math.abs(orderSizeDifference) as Amount;

    if (
      await isDifferenceTooLow(
        stableDex,
        unstableDex,
        absPositionSizeDifference
      )
    )
      return;

    const newOrderSide = determineNewOrderSide(orderSizeDifference);

    SHOW_MORE_LOGS &&
      logger.debug(
        `Creating new order. Side ${newOrderSide} Amount ${absPositionSizeDifference}`
      );

    await createNewOrderAndPosition(
      unstableDex,
      stableDex,
      newOrderSide,
      absPositionSizeDifference,
      spreadAdjustment,
      logger
    );

    state.savedFilledOrderSize = state.filledOrdersSize;
  };
};

const createNewOrderAndPosition = async (
  unstableDex: UnstableDex,
  stableDex: StableDex,
  newOrderSide: OrderSide,
  absPositionSizeDifference: Amount,
  spreadAdjustment: Percent,
  logger: Logger
) => {
  await Promise.all([
    addSizeToAnOrderOnUnstable(
      unstableDex,
      newOrderSide,
      absPositionSizeDifference,
      () => getReliablePriceFromStable(stableDex, spreadAdjustment),
      logger
    ),
    openPositionOnStable(
      stableDex,
      toPositionSide(newOrderSide),
      absPositionSizeDifference
    ),
  ]);
};
