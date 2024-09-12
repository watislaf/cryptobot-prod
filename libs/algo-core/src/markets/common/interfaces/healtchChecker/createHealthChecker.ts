import { LoggerFactory } from '@arbitrage/logger';
import { SymbolBB, SymbolHL } from '@arbitrage/algo-types';
import { ApiBB, ApiHL, createTokenCleanerLogger } from '@arbitrage/algo-core';
import { Order, Position } from 'ccxt/js/src/base/types';

export enum HealthCheck {
  Ok = 'Ok',
  Warning = 'Warning',
  Error = 'Error',
}

export type HealthFuncResult = {
  status: HealthCheck;
  message?: string;
};

export type HealthFunc = (
  position: Position,
  orders: Order[]
) => HealthFuncResult;

export type HealthChecker = {
  throwIfUnhealthy: (arg: HealthFunc) => Promise<HealthCheck>;
};

const createHealthChecker = (
  api: {
    getPosition: (symbol: any) => Promise<Position>;
    getOpenOrders: (symbol: any) => Promise<Order[]>;
  },
  symbol: any,
  loggerFactory: LoggerFactory
): HealthChecker => {
  const logger = createTokenCleanerLogger(loggerFactory);

  const throwIfUnhealthy = async (
    checkHealth: HealthFunc
  ): Promise<HealthCheck> => {
    let attempts = 0;

    const check = async (): Promise<HealthCheck> => {
      const [positions, openOrders] = await Promise.all([
        api.getPosition(symbol),
        api.getOpenOrders(symbol),
      ]);

      const result = checkHealth(positions, openOrders);

      if (result.status === HealthCheck.Ok) {
        return HealthCheck.Ok;
      }

      if (result.status === HealthCheck.Error) {
        const errorMessage =
          result.message || 'Health check failed with Error.';
        throw new Error(errorMessage);
      }

      if (result.status === HealthCheck.Warning && attempts < 3) {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return check();
      }

      return HealthCheck.Error;
    };

    return check();
  };

  return {
    throwIfUnhealthy,
  };
};

// Health checker for HL
export const createHealthCheckerHL = (
  api: ApiHL,
  symbol: SymbolHL,
  loggerFactory: LoggerFactory
): HealthChecker => {
  return createHealthChecker(api, symbol, loggerFactory);
};

// Health checker for BB
export const createHealthCheckerBB = (
  api: ApiBB,
  symbol: SymbolBB,
  loggerFactory: LoggerFactory
): HealthChecker => {
  return createHealthChecker(api, symbol, loggerFactory);
};
