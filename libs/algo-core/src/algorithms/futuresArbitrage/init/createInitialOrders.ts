import {
  AlgoArgs,
  AlgoOptions,
  getReliablePriceFromStable,
  throwOnError,
} from '@arbitrage/algo-core';
import { Dollar, OrderSide, TEN_PERCENTS } from '@arbitrage/algo-types';

export const createInitialOrders = async (
  args: AlgoArgs,
  options: AlgoOptions
) => {
  await validateCurrentBalance(args, options);
  await initializeOrdersPair(args, options);
};

const validateCurrentBalance = async (
  { stableDex, unstableDex }: AlgoArgs,
  { availableTokens }: AlgoOptions
) => {
  const { buyPrice } = await getReliablePriceFromStable(
    stableDex,
    TEN_PERCENTS
  );
  const algoMinimumRequirement = (availableTokens * buyPrice) as Dollar;
  const unstableBalance = await unstableDex.getAvailableBalance();

  if (unstableBalance < algoMinimumRequirement) {
    throw new Error(
      `Insufficient balance for the algo to run ${unstableDex.name}. Required: ${algoMinimumRequirement}$, available: ${unstableBalance}$. Reduce amount of tokens to use.`
    );
  }

  const stableBalance = await stableDex.getAvailableBalance();
  if (stableBalance < algoMinimumRequirement) {
    throw new Error(
      `Insufficient balance for the algo to run ${stableDex.name}. Required: ${algoMinimumRequirement}$, available: ${stableBalance}$. Reduce amount of tokens to use.`
    );
  }
};

const initializeOrdersPair = async (args: AlgoArgs, options: AlgoOptions) => {
  const { unstableDex } = args;
  const { availableTokens } = options;
  const { buyPrice, sellPrice } = await getReliablePriceFromStable(
    args.stableDex,
    options.spreadAdjustment
  );

  const orders = await unstableDex.createOrders(
    { amount: availableTokens, side: OrderSide.Buy, price: buyPrice },
    { amount: availableTokens, side: OrderSide.Sell, price: sellPrice }
  );
  orders.forEach(throwOnError);
};
