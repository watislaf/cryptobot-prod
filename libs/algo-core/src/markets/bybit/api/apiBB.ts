import * as ccxt from 'ccxt';
import { Dollar } from '@arbitrage/algo-types';
import { ApiBB, parseOrderResponse } from '@arbitrage/algo-core';
import {
  BYBIT_API_KEY,
  BYBIT_API_KEY_TEST,
  BYBIT_API_SECRET,
  BYBIT_API_SECRET_TEST,
  USE_TEST_NET,
} from '@arbitrage/env';

const _api = new ccxt.pro.bybit({
  apiKey: USE_TEST_NET ? BYBIT_API_KEY_TEST : BYBIT_API_KEY,
  secret: USE_TEST_NET ? BYBIT_API_SECRET_TEST : BYBIT_API_SECRET,
});

_api.setSandboxMode(USE_TEST_NET);

const minOrderValue = 5 as Dollar;

export const apiBB: ApiBB = {
  getOrderBook: (symbol) => _api.watchOrderBook(symbol, 1),
  createOrders: async (requests) =>
    (await _api.createOrders(requests)).map((r) =>
      parseOrderResponse(r, requests)
    ),
  cancelOrders: (ids, symbol) => _api.cancelOrders(ids, symbol),
  getOpenOrders: (symbol) => _api.fetchOpenOrders(symbol),
  getPosition: (symbol) => _api.fetchPosition(symbol),
  getAvailableBalance: async () => {
    const balance = await _api.fetchBalance();

    const free = balance['free'] as unknown as { [key: string]: number };
    const usdc = free['USDC'] || 0;
    const usdt = free['USDT'] || 0;

    if (usdc + usdt === 0)
      throw new Error('The sum of USDT and USDC on balance is 0');

    return (usdc + usdt) as Dollar;
  },
  minOrderValue,
};
