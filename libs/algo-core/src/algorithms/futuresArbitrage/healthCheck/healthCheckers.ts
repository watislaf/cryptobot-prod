import {
  AlgoArgs,
  AlgoOptions,
  executeWithAbort,
  HealthCheck,
  HealthFunc,
  sleep,
} from '@arbitrage/algo-core';

export const checkStableDex = (options: AlgoOptions): HealthFunc => {
  return (position, openOrders) => {
    if (openOrders.length > 0) {
      return {
        status: HealthCheck.Error,
        message: 'There should be no open orders on the stable dex',
      };
    }
    if (
      position.contracts &&
      Math.abs(position.contracts) > options.availableTokens
    ) {
      return {
        status: HealthCheck.Error,
        message: `Position on the stable dex has size ${Math.abs(
          position.contracts
        )}. The value should be less than ${options.availableTokens}`,
      };
    }
    return {
      status: HealthCheck.Ok,
    };
  };
};

export const checkUnstableDex = (options: AlgoOptions): HealthFunc => {
  return (position, openOrders) => {
    const totalOrderSize = openOrders.reduce(
      (sum, order) => sum + order.amount,
      0
    );
    if (totalOrderSize > options.availableTokens * 2) {
      return {
        status: HealthCheck.Error,
        message: `On unstable dex sum of order sizes should be less than available tokens times 2 (${
          options.availableTokens * 2
        })`,
      };
    }
    if (
      position.contracts &&
      Math.abs(position.contracts) > options.availableTokens
    ) {
      return {
        status: HealthCheck.Error,
        message: `Position on the unstable dex has size ${Math.abs(
          position.contracts
        )}. The value should be less than ${options.availableTokens}`,
      };
    }
    return {
      status: HealthCheck.Ok,
    };
  };
};

export const monitorHealth = async (
  { unstableDex, stableDex }: AlgoArgs,
  options: AlgoOptions,
  isActive: () => boolean
): Promise<void> => {
  while (isActive()) {
    await executeWithAbort(
      async () => {
        await Promise.all([
          stableDex.throwIfUnhealthy(checkStableDex(options)),
          unstableDex.throwIfUnhealthy(checkUnstableDex(options)),
        ]);
        await sleep(8000);
      },
      () => !isActive()
    );
  }
};
