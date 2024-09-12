import { OnFilled, OrderBasicFilter, OrderHL } from '@arbitrage/algo-core';
import { Amount, ClientOrderId, OrderId } from '@arbitrage/algo-types';

const matchesCoid = (coid: ClientOrderId) => (order: OrderHL) =>
  order.coid === coid;

const matchesId = (id: OrderId) => (order: OrderHL) => order.id === id;

export const createOrderStorage = () => {
  let orders: OrderHL[] = [];
  const onFilledCallbacks: OnFilled[] = [];
  const registered = new Set<ClientOrderId>();
  let updatesQueue: { order: OrderHL; filledDifference: Amount }[] = [];

  const update = (newOrder: OrderHL) => {
    let index = orders.findIndex(matchesCoid(newOrder.coid));
    let filledDifference = 0 as Amount;

    if (index === -1) {
      orders.push(newOrder);
      filledDifference = newOrder.filled;
    } else {
      filledDifference = (newOrder.filled - orders[index].filled) as Amount;
      orders[index] = newOrder;
    }

    updatesQueue.push({ order: newOrder, filledDifference });

    return { updatedOrder: newOrder, filledDifference };
  };

  const cleanUpOrders = (): void => {
    orders = orders.filter((order) => order.amount !== order.filled);
  };

  const callOnFilled = async () => {
    await Promise.all(
      updatesQueue
        .filter(({ filledDifference }) => filledDifference > 0)
        .flatMap(({ order, filledDifference }) =>
          onFilledCallbacks.map((callback) => callback(order, filledDifference))
        )
    );
    updatesQueue = [];
    cleanUpOrders();
  };

  return {
    update,
    findByCoid: (coid: ClientOrderId) => orders.find(matchesCoid(coid)),
    findById: (id: OrderId) => orders.find(matchesId(id)),
    filter: (condition: OrderBasicFilter) => orders.filter(condition),
    onFilled: (onFilled: OnFilled) => onFilledCallbacks.push(onFilled),
    remove({ coid, id }: { coid: ClientOrderId; id: OrderId }) {
      orders = orders.filter((order) => order.coid !== coid && order.id !== id);
    },
    register(coid: ClientOrderId) {
      registered.add(coid);
    },
    isRegistered(coid: ClientOrderId) {
      return registered.has(coid);
    },
    callOnFilled,
  };
};
