import { BidAndAsk, OrderSide, Percent, Price } from '@arbitrage/algo-types';

export const forSide = (bidAndAsk: BidAndAsk, side: OrderSide) =>
  side === OrderSide.Buy ? bidAndAsk.bid : bidAndAsk.ask;

export const withExpandedSpread = ({ bid, ask }: BidAndAsk, delta: Percent) =>
  ({
    bid: bid * (1 - delta),
    ask: ask * (1 + delta),
  } as BidAndAsk);

export const percentDiff = (left: Price, right: Price) => {
  if (left === 0) return 0;
  return Math.abs((right - left) / left) as Percent;
};
