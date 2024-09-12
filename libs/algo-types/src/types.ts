import { z } from 'zod';

export type OrderId = string & { readonly brand: unique symbol };
export type ClientOrderId = string & { readonly brand: unique symbol };
export type Price = number & { readonly brand: unique symbol };
export type Amount = number & { readonly brand: unique symbol }; // only positive
export type PositionAmount = number & { readonly brand: unique symbol }; // positive and negative
export type Percent = number & { readonly brand: unique symbol }; // 0.2 for 20 percents
export type Dollar = number & { readonly brand: unique symbol };

export const TEN_PERCENTS = 0.1 as Percent;
export const TEN_PERCENTS_MORE = (1 + TEN_PERCENTS) as Percent;
export const ONE_SECOND = 1000;
export const TEN_SECONDS = ONE_SECOND * 10;

export type BidAndAsk = { bid: Price; ask: Price };

export enum OrderSide {
  Buy = 'buy',
  Sell = 'sell',
}

export enum PositionSide {
  Long = 'long',
  Short = 'short',
}

export enum OrderType {
  Limit = 'limit',
  Market = 'market',
}

export enum OrderStatus {
  Filled = 'filled',
  Open = 'open',
  Canceled = 'canceled',
}

export enum SymbolHL {
  BTC_USDC_PERP = 'BTC/USDC:USDC',
  TAO_USDC_PERP = 'TAO/USDC:USDC',
  POPCAT_USDC_PERP = 'POPCAT/USDC:USDC',
  EIGEN_USDC_PERP = 'EIGEN/USDC:USDC',
  BANANA_USDC_PERP = 'BANANA/USDC:USDC',
}

export enum SymbolBB {
  BTC_USDT_PERP = 'BTC/USDT:USDT',
  TAO_USDT_PERP = 'TAO/USDT:USDT',
  POPCAT_USDT_PERP = 'POPCAT/USDT:USDT',
  EIGEN_USDT_PERP = 'EIGEN/USDT:USDT',
  BANANA_USDT_PERP = 'BANANA/USDT:USDT',
}

export enum SymbolBasic {
  BTC = 'BTC',
  TAO = 'TAO',
  POPCAT = 'POPCAT',
  EIGEN = 'EIGEN',
  BANANA = 'BANANA',
}

export const SymbolBasicZ = z.nativeEnum(SymbolBasic);

export enum MarketName {
  HyperLiquid = 'HyperL',
  ByBit = 'BBit',
}

export interface MarketInfoValue {
  name: MarketName;
  minOrderValue: Dollar;
  symbols: Record<SymbolBasic, string>;
}

export const MarketInfo: Record<MarketName, MarketInfoValue> = {
  [MarketName.ByBit]: {
    name: MarketName.ByBit,
    minOrderValue: 5 as Dollar,
    symbols: {
      [SymbolBasic.BTC]: SymbolBB.BTC_USDT_PERP,
      [SymbolBasic.TAO]: SymbolBB.TAO_USDT_PERP,
      [SymbolBasic.POPCAT]: SymbolBB.POPCAT_USDT_PERP,
      [SymbolBasic.EIGEN]: SymbolBB.EIGEN_USDT_PERP,
      [SymbolBasic.BANANA]: SymbolBB.BANANA_USDT_PERP,
    },
  },
  [MarketName.HyperLiquid]: {
    name: MarketName.HyperLiquid,
    minOrderValue: 10 as Dollar,
    symbols: {
      [SymbolBasic.BTC]: SymbolHL.BTC_USDC_PERP,
      [SymbolBasic.TAO]: SymbolHL.TAO_USDC_PERP,
      [SymbolBasic.POPCAT]: SymbolHL.POPCAT_USDC_PERP,
      [SymbolBasic.EIGEN]: SymbolHL.EIGEN_USDC_PERP,
      [SymbolBasic.BANANA]: SymbolHL.BANANA_USDC_PERP,
    },
  },
};
