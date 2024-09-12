import { TokenCleanerLogger } from '@arbitrage/algo-core';
import { Amount, OrderId, PositionSide } from '@arbitrage/algo-types';
import { Order } from 'ccxt/js/src/base/types';

export async function cleanOrders(
  openOrdersSupplier: () => Promise<Order[]>,
  cancelOrders: (orderIds: OrderId[]) => Promise<void>,
  logger: TokenCleanerLogger
) {
  const openOrders = await openOrdersSupplier();
  const orderIds = openOrders.map((order) => order.id as OrderId);
  if (orderIds.length === 0) {
    logger.noOrdersToCancel();
    return;
  }
  await cancelOrders(orderIds);
  logger.ordersClosed(openOrders.map((order) => order.amount as Amount));
}

export async function cleanPositionsUsingReducerOrder(
  { side, amount }: { amount: Amount; side: PositionSide },
  createReduceOrder: (amount: Amount, side: PositionSide) => Promise<void>,
  logger: TokenCleanerLogger
) {
  await createReduceOrder(amount, side);
  logger.positionClosed(amount, side);
}
