import type { OrderBook } from 'ccxt/js/src/base/types';
import { BidAndAsk, Price } from '@arbitrage/algo-types';

export const extractBidAndAsk = (book: OrderBook) => {
  const bid = book.bids?.[0]?.[0];
  const ask = book.asks?.[0]?.[0];
  if (bid === undefined || ask === undefined) {
    return undefined;
  }

  return { bid, ask } as BidAndAsk;
};

export type BidAndAskSupplier = {
  getBidAndAsk(instantly?: boolean): Promise<{ bid: Price; ask: Price }>;
};
