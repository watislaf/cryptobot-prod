import { ApiBB, extractBidAndAsk, retry } from '@arbitrage/algo-core';
import { LoggerFactory } from '@arbitrage/logger';
import { BidAndAsk, SymbolBB, TEN_SECONDS } from '@arbitrage/algo-types';

const LOG_INTERVAL = 1000;
export const createBidAndAskSupplierBB = (
  api: ApiBB,
  symbol: SymbolBB,
  loggerFactory: LoggerFactory
) => {
  let fetchCount = 0;
  let cachedPrices: BidAndAsk | null = null;
  let lastFetchTimestamp: number = 0;
  const logger = loggerFactory('BidAndAsk');

  const isCacheValid = (currentTimestamp: number): boolean => {
    return (
      !!cachedPrices && currentTimestamp - lastFetchTimestamp < TEN_SECONDS
    );
  };

  const logPriceInfo = (currentPrices: BidAndAsk) => {
    if (fetchCount === 0) {
      cachedPrices = currentPrices;
    }
    fetchCount++;

    if (fetchCount % LOG_INTERVAL === 0) {
      const { bid, ask } = currentPrices;
      logger.info(`Fetch #${fetchCount}: Bid: ${bid}, Ask: ${ask}`);
    }
  };

  const fetchBidAndAsk = async (): Promise<BidAndAsk> => {
    const fetchOperation = async () => {
      const fetchedData = await api.getOrderBook(symbol);
      return extractBidAndAsk(fetchedData);
    };

    return retry(fetchOperation, logger, 'Unable to fetch bid and ask');
  };

  const getBidAndAsk = async (instantly = false): Promise<BidAndAsk> => {
    const currentTimestamp = Date.now();

    if (instantly) {
      if (isCacheValid(currentTimestamp)) return cachedPrices!;
      logger.warn(
        'Data was fetched instead of using instant value due to old data.'
      );
    }

    const currentPrices = await fetchBidAndAsk();

    lastFetchTimestamp = currentTimestamp;
    cachedPrices = currentPrices;
    logPriceInfo(currentPrices);

    return currentPrices;
  };

  return { getBidAndAsk };
};
