import { LoggerFactory } from '@arbitrage/logger';

const MAX_RETRIES = 10;
const RETRY_DELAY = 1000; // 1 second

export const retry = async <T>(
  operation: () => Promise<T | undefined>,
  logger: ReturnType<LoggerFactory>,
  errorMessage: string
): Promise<T> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await operation();
    if (result !== undefined) {
      return result;
    }
    logger.warn(
      `${errorMessage}. Attempt ${attempt}/${MAX_RETRIES} failed. Retrying...`
    );
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
  }
  throw new Error(`Operation failed after ${MAX_RETRIES} attempts`);
};
