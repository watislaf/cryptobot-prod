import { AlgoArgs, AlgoOptions } from './types';
import { createLogger } from '@arbitrage/logger';
import {
  createInitialOrders,
  createPromiseTrackerService,
  createWhenOrderIsFilledOpenNewOrders,
  gracefulStopAlgoWrapper,
  monitorAndRefreshOrderPrices,
  monitorHealth,
} from '@arbitrage/algo-core';

const executeFuturesArbitrage = (
  args: AlgoArgs,
  options: AlgoOptions,
  logger: ReturnType<typeof createLogger>
) => {
  const { unstableDex, stableDex } = args;
  let isActive = true;
  const promiseTracker = createPromiseTrackerService();
  const clean = async () => {
    await Promise.all([
      stableDex.cleanOrdersAndPositions(),
      unstableDex.cleanOrdersAndPositions(),
    ]);
  };

  const stop = async () => {
    if (isActive) {
      isActive = false;
      await promiseTracker.waitForAll();
      await clean();
    }
  };

  const run = async () => {
    logger.info(
      `Starting futures arbitrage algo: Tokens: ${
        options.availableTokens
      }  Spread: ${options.spreadAdjustment * 100}%`
    );
    await clean();
    const runOrderManager = unstableDex.runOrderManager(
      createWhenOrderIsFilledOpenNewOrders(args, options, logger),
      () => isActive
    );
    await createInitialOrders(args, options);
    await Promise.all([
      monitorAndRefreshOrderPrices(args, options, () => isActive),
      runOrderManager,
      monitorHealth(args, options, () => isActive),
    ]);
  };

  return { run: () => promiseTracker.addPromise(run()), stop };
};

export const createFuturesArbitrageAlgo = gracefulStopAlgoWrapper(
  executeFuturesArbitrage
);
