import { v4 as uuidv4 } from 'uuid';
import {
  Amount,
  ClientOrderId,
  Dollar,
  OrderSide,
  PositionSide,
  Price,
} from '@arbitrage/algo-types';

export const unique128bit = () =>
  ('0x' + uuidv4().replace(/-/g, '')) as ClientOrderId;

type Supplier<Supplied, Return> = (data: Supplied) => Return;

export type UpdateSupplier<Supplied, UpdateObj> =
  | UpdateObj
  | Supplier<Supplied, UpdateObj>;

export const callUpdate = <UpdateObj, Supplied>(
  data: Supplied,
  update: UpdateSupplier<Supplied, UpdateObj>
): UpdateObj =>
  typeof update === 'function'
    ? (update as Supplier<Supplied, UpdateObj>)(data)
    : update;

export const toOrderSide = (side: PositionSide) =>
  side === PositionSide.Long ? OrderSide.Buy : OrderSide.Sell;
export const toPositionSide = (side: OrderSide) =>
  side === OrderSide.Buy ? PositionSide.Long : PositionSide.Short;

export const getDollarValue = ({
  price,
  amount,
}: {
  price: Price;
  amount: Amount;
}) => {
  return (price * amount) as Dollar;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
