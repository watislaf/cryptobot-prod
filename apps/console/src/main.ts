import { createLogger } from '@arbitrage/logger';
import { Amount, Percent, SymbolBasic } from '@arbitrage/algo-types';
import {
  createBbDriver,
  createFuturesArbitrageAlgo,
  createHlDriver,
} from '@arbitrage/algo-core';

const consoleLogger = createLogger('Console');

const main = async () => {
  consoleLogger.info('Starting futures arbitrage algo');

  const algo = createFuturesArbitrageAlgo(
    {
      stableDex: createBbDriver(SymbolBasic.TAO),
      unstableDex: createHlDriver(SymbolBasic.TAO),
    },
    {
      spreadAdjustment: 0.01 as Percent,
      stalePriceThreshold: 0.001 as Percent,
      availableTokens: 0.1 as Amount,
    },
    createLogger(`[ALGO-Console]`)
  );
  algo.run();
  await new Promise((r) => setTimeout(r, 12000000));
  consoleLogger.info('Stopping futures arbitrage algo after 200 mins');
  await algo.stop();
};

main();

/*
import { createLogger } from '@arbitrage/logger';
import { createFuturesArbitrageAlgo } from '../algorithms';
import { simulationConfig } from './config';
import { fetchHistoricalData } from './data/dataFetcher';
import {
  createStableSimulationDriver,
  createUnstableSimulationDriver,
} from './drivers';
import { runSimulation } from './engine';
import { Amount, Percent } from '../types';
import { SymbolStable, SymbolUnstable } from './types/simulationTypes';

const main = async () => {
  // console.log('Fetching historical data...');
  const targetCandleCount = 10_000;
  // await fetchHistoricalData(
  //     simulationConfig.exchangeId,
  //     simulationConfig.symbol,
  //     simulationConfig.timeframe,
  //     simulationConfig.since,
  //     targetCandleCount
  // );

  // console.log('Running simulation...');
  // runSimulation(
  //     simulationConfig.exchangeId,
  //     simulationConfig.symbol,
  //     simulationConfig.timeframe,
  //     simulationConfig.speedFactor,
  //     simulationConfig.since
  // );

  const algo = createFuturesArbitrageAlgo(
    {
      stableDex: createStableSimulationDriver(SymbolStable.TAO_USDT_PERP),
      unstableDex: createUnstableSimulationDriver(SymbolUnstable.TAO_USDC_PERP),
    },
    {
      spreadAdjustment: 0.0 as Percent,
      stalePriceThreshold: 0.0 as Percent,
      availableTokens: 0.035 as Amount,
    },
    createLogger(`FuturesArbitrageSimulation`)
  );

  algo.run();
  await new Promise((r) => setTimeout(r, 12000));
  await algo.stop();
};

main();

 */
