import {
  createOrderError,
  getDollarValue,
  OrderErrorType,
} from '@arbitrage/algo-core';
import {
  Amount,
  Dollar,
  MarketName,
  Price,
  TEN_PERCENTS_MORE,
} from '@arbitrage/algo-types';

export const validateMinDollarValue = (
  { price, amount }: { price: Price; amount: Amount },
  minOrderValue: Dollar,
  name: MarketName
) => {
  const dollarValue = getDollarValue({ price, amount });
  const minDollarValue = (minOrderValue * TEN_PERCENTS_MORE) as Dollar;
  if (dollarValue < minDollarValue) {
    return createOrderError(
      OrderErrorType.MinValue,
      {
        dollarValue,
        minDollarValue,
      },
      `Cant create order on ${name}. The value is less than the minimum required value: ${dollarValue}$ < ${minDollarValue}$`
    );
  }
  return undefined;
};
