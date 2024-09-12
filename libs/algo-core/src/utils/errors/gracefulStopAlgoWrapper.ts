import { createLogger } from '@arbitrage/logger';
import { ONE_SECOND } from '@arbitrage/algo-types';

export type Algo = (...args: any[]) => {
  stop: () => Promise<void>;
  run: () => Promise<void>;
};

const logger = createLogger('[ALGO]');

export class AlgoTerminationError extends Error {
  constructor(originalError: unknown) {
    super('AlgoTerminationError');
    this.name = 'AlgoTerminationError';
    if (
      typeof originalError === 'object' &&
      originalError !== null &&
      'stack' in originalError
    ) {
      const customError = originalError as Record<string, unknown>;

      Object.assign(this, {
        data: {
          type: customError?.['type'],
          ...((customError?.['data'] as object) || {}),
        },
      });

      this.stack = '' + customError?.['stack'];
      this.message = '' + customError?.['message'];
    } else {
      this.stack = JSON.stringify(originalError);
    }
  }
}

export const gracefulStopAlgoWrapper = <T extends Algo>(algo: T) => {
  return (...args: Parameters<T>) => {
    const { run, stop } = algo(...args);
    let isRunning = false;

    const exponentialBackoff = async (
      retryFunction: () => Promise<void>,
      retries = 0
    ): Promise<void> => {
      const delay = Math.pow(2, 4) * ONE_SECOND; // Exponential backoff: 1s, 2s, 4s, 8s, ...
      try {
        await retryFunction();
      } catch (error) {
        if (retries < 5) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          await exponentialBackoff(retryFunction, retries + 1);
        } else {
          throw error;
        }
      }
    };

    const safeStop = async (): Promise<void> => {
      try {
        await exponentialBackoff(stop);
      } catch (stopError) {
        logger.error('Algo failed to terminate after retries:', stopError);
        throw stopError;
      }
    };

    const safeRun = async (): Promise<Error | undefined> => {
      try {
        isRunning = true;
        await run().finally(() => {
          isRunning = false;
        });
      } catch (error) {
        const newError =
          error instanceof Error ? error : new AlgoTerminationError(error);

        logger.error(newError);
        await safeStop();
        logger.info('Algo terminated successfully.');

        return newError;
      }
      return undefined;
    };

    const handleTerminationSignal = async (signal: string) => {
      logger.info(`Application was terminated. Stopping the algo...`);
      try {
        await safeStop();
        process.exit(1);
      } catch (error) {
        logger.error('Error while terminating algo:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => handleTerminationSignal('SIGINT'));
    process.on('SIGTERM', () => handleTerminationSignal('SIGTERM'));

    return {
      run: safeRun,
      stop: safeStop,
      isRunning: () => isRunning,
    };
  };
};
