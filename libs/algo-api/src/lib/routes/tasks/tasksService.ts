import {
  createBbDriver,
  createFuturesArbitrageAlgo,
  createHlDriver,
} from '@arbitrage/algo-core';
import { Amount, Percent, SymbolBasic } from '@arbitrage/algo-types';
import {
  AlgoEventPayloads,
  AlgoEventType,
  AlgoLogEvent,
  createLogger,
  getAlgoEventEmitter,
} from '@arbitrage/logger';

type TaskParams = {
  currency: SymbolBasic;
  spread: Percent;
  tokens: Amount;
  savedLogs: AlgoLogEvent[];
};

class TaskService {
  private algo: ReturnType<typeof createFuturesArbitrageAlgo> | null = null;
  private isRunning: boolean = false;
  private isStopping: boolean = false;
  private lastParams: TaskParams | null = null;
  private algoPromise: Promise<Error | undefined> | null = null;

  async run({ currency, spread, tokens }: TaskParams): Promise<void> {
    if (this.isRunning) {
      throw new Error('Task is already running');
    }

    this.algo = createFuturesArbitrageAlgo(
      {
        stableDex: createBbDriver(currency),
        unstableDex: createHlDriver(currency),
      },
      {
        spreadAdjustment: spread,
        stalePriceThreshold: (spread / 10) as Percent,
        availableTokens: tokens,
      },
      createLogger('[ALGO-Server]')
    );

    this.lastParams = { currency, spread, tokens, savedLogs: [] };

    this.algoPromise = this.algo.run();
    getAlgoEventEmitter().emit({
      eventType: AlgoEventType.STATUS,
      isRunning: true,
    });
    this.algoPromise.then(() => {
      getAlgoEventEmitter().emit({
        eventType: AlgoEventType.STATUS,
        isRunning: false,
      });
    });
  }

  async stop(): Promise<void> {
    if (this.isStopping || !this.algo) {
      throw new Error(
        'You cant stop now since algo is already in a stop prcoess...'
      );
    }
    this.isStopping = true;
    await this.algo.stop().then(() => {
      this.isStopping = false;
    });
  }

  getStatus(): { isRunning: boolean; params: TaskParams | null } {
    return {
      isRunning: this.algo?.isRunning() || false,
      params: this.lastParams,
    };
  }

  saveLogs(data: AlgoEventPayloads[AlgoEventType.LOG]) {
    if (!this.lastParams) {
      return;
    }
    this.lastParams = {
      ...this.lastParams,
      savedLogs: [...this.lastParams?.savedLogs, data].slice(0, 1000),
    };
  }
}

export const taskService = new TaskService();

getAlgoEventEmitter().on(AlgoEventType.LOG, taskService.saveLogs);
