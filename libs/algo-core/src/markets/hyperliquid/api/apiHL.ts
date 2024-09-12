import {
  ApiHL,
  parseCreateOrderResponse,
  parseHlOrderError,
  parseOrderUpdate,
  parseUpdateOrderResponse,
  validateMinDollarValue,
} from '@arbitrage/algo-core';
import * as ccxt from 'ccxt';
import { Dollar, MarketName, SymbolHL } from '@arbitrage/algo-types';
import { PRIVATE_KEY, USE_TEST_NET, WALLET_ADDRESS } from '@arbitrage/env';

// Initialize the Hyperliquid API
const _api = new ccxt.pro.hyperliquid({
  privateKey: PRIVATE_KEY,
  walletAddress: WALLET_ADDRESS,
});

_api.setSandboxMode(USE_TEST_NET);

// This is a workaround. When using testNet Ping/Pong messages are not supported as well as on mainnet.
// So we need to watch the order book to get the updates and to keep connection opened.
USE_TEST_NET && _api.watchOrderBook(SymbolHL.TAO_USDC_PERP);

const MIN_ORDER_VALUE = 10 as Dollar;

export const apiHL: ApiHL = {
  minOrderValue: MIN_ORDER_VALUE,
  editOrder: async (orderToUpdate, request, symbol) => {
    const price = request.price ?? orderToUpdate.price;
    const amount = request.amount ?? orderToUpdate.amount;

    const validationResult = validateMinDollarValue(
      { amount, price },
      MIN_ORDER_VALUE,
      MarketName.HyperLiquid
    );
    if (validationResult) return validationResult;

    try {
      const updated = await _api.editOrderWs(
        orderToUpdate.id,
        symbol,
        'limit',
        orderToUpdate.side,
        amount,
        price,
        {
          clientOrderId: orderToUpdate.coid,
        }
      );
      return parseUpdateOrderResponse(updated, price, amount, orderToUpdate);
    } catch (error) {
      return parseHlOrderError(error, { price, amount });
    }
  },
  createOrders: async (requests) => {
    return Promise.all(
      requests.map(async (request) => {
        const preValidation = validateMinDollarValue(
          request,
          MIN_ORDER_VALUE,
          MarketName.HyperLiquid
        );
        if (preValidation) return preValidation;

        try {
          const order = await _api.createOrderWs(
            request.symbol,
            'limit',
            request.side,
            request.amount,
            request.price,
            {
              clientOrderId: request.params.clientOrderId,
            }
          );
          return parseCreateOrderResponse(order, request);
        } catch (error) {
          return parseHlOrderError(error, request);
        }
      })
    );
  },
  getOpenOrders: (symbol) => _api.fetchOpenOrders(symbol),
  cancelOrders: (ids, symbol) => _api.cancelOrders(ids, symbol),
  getPosition: (symbol) => _api.fetchPosition(symbol),
  getOrderBook: (symbol) => _api.fetchOrderBook(symbol),
  watchOrders: async (symbol) => {
    const updated = await _api.watchOrders();
    return updated.map(parseOrderUpdate);
  },
  getAvailableBalance: async () => {
    const balance = await _api.fetchBalance();
    const free = balance['free'] as unknown as { [key: string]: number };
    const usdc = free['USDC'] || 0;

    if (usdc === 0) {
      throw new Error('USDC not found in balance');
    }

    return usdc as Dollar;
  },
};
