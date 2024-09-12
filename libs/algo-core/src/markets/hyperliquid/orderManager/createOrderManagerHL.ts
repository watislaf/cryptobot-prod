import {
  ApiHL,
  callUpdate,
  createLockService,
  createOrderError,
  createOrderManagerLogger,
  CreateOrderRequest,
  createOrderStorage,
  createPromiseTrackerService,
  executeWithAbort,
  HlOrderUpdate,
  isError,
  isSuccess,
  OnFilled,
  OrderBasicFilter,
  OrderErrorDetails,
  OrderErrorType,
  OrderHL,
  OrderManagerInterface,
  OrderUpdateSupplier,
  PromiseTrackerService,
  throwOnError,
  toHlCreateOrderRequest,
  wasAborted,
  WrappedResult,
} from '@arbitrage/algo-core';
import {
  Amount,
  ClientOrderId,
  OrderId,
  OrderStatus,
  SymbolHL,
} from '@arbitrage/algo-types';
import { LoggerFactory } from '@arbitrage/logger';

const lastIsCanceled = (
  a: { status: OrderStatus },
  b: { status: OrderStatus }
) => {
  if (a.status === OrderStatus.Canceled) {
    return 1;
  }
  if (b.status === OrderStatus.Canceled) {
    return -1;
  }
  return 0;
};

export const createOrderManagerHL = (
  api: ApiHL,
  symbol: SymbolHL,
  loggerFactory: LoggerFactory
): OrderManagerInterface => {
  const logger = createOrderManagerLogger(loggerFactory);
  const lockService = createLockService<string>();
  const orderStorage = createOrderStorage();
  const promiseTracker: PromiseTrackerService = createPromiseTrackerService();

  const createOrders = async (...ordersToCreate: CreateOrderRequest[]) => {
    const requests = ordersToCreate.map((request) =>
      toHlCreateOrderRequest({ ...request, symbol })
    );
    requests
      .map((request) => request.params.clientOrderId)
      .forEach(orderStorage.register);
    requests.map((request) => logger.orderCreated(request));
    const orders = await api.createOrders(requests);
    orders.filter(isSuccess).map((order) => orderStorage.update(order.data));
    return orders;
  };

  const updateOrder = async (
    coid: ClientOrderId,
    update: OrderUpdateSupplier
  ): Promise<WrappedResult<OrderHL, OrderErrorDetails>> =>
    lockService.acquire(coid, async () => {
      const currentOrder = orderStorage.findByCoid(coid);
      if (!currentOrder)
        return createOrderError(
          OrderErrorType.OrderDoesNotExist,
          undefined,
          ''
        );

      const request = callUpdate(currentOrder, update);
      logger.orderEdited(currentOrder, request);
      const result = await api.editOrder(currentOrder, request, symbol);
      if (isError(result)) {
        logger.orderUpdateFailed(result, coid, currentOrder.id);
      } else {
        orderStorage.update(result.data);
      }
      return result;
    });

  const updateOrders = async (
    filter: OrderBasicFilter,
    update: OrderUpdateSupplier
  ): Promise<WrappedResult<OrderHL, OrderErrorDetails>[]> => {
    const ordersToUpdate = orderStorage
      .filter(filter)
      .map((order) => order.coid);
    return await Promise.all(
      ordersToUpdate.map((coid) => updateOrder(coid, update))
    );
  };

  const processOrderUpdate = async (update: HlOrderUpdate) => {
    logger.orderEvent(update);

    switch (update.status) {
      case OrderStatus.Filled:
      case OrderStatus.Open:
        orderStorage.update(update.order);
        break;
      case OrderStatus.Canceled:
        await handleCanceledOrder(update);
        break;
    }
  };

  const handleCanceledOrder = async (update: HlOrderUpdate) => {
    const found = orderStorage.findById(update.order.id as OrderId);
    if (found && found.id === update.order.id) {
      orderStorage.update(update.order);
      orderStorage.remove(update.order);

      const result = await createOrders({
        amount: (update.order.amount - update.order.filled) as Amount,
        price: update.order.price,
        side: update.order.side,
        params: {
          coid: update.order.coid,
        },
      });
      result.map(throwOnError);
    }
  };

  const isRegistered = (update: HlOrderUpdate) => {
    return orderStorage.isRegistered(update.order.coid as ClientOrderId);
  };

  const runOrderManager = async (
    onFilled: OnFilled,
    isRunning: () => boolean
  ) => {
    orderStorage.onFilled(onFilled);
    orderStorage.onFilled(logger.orderIsFilled);

    while (isRunning) {
      const updates = await executeWithAbort(
        () => api.watchOrders(symbol),
        () => !isRunning()
      );
      if (wasAborted(updates)) return;

      const sortedUpdates = updates.filter(isRegistered).sort(lastIsCanceled);
      await Promise.all(sortedUpdates.map(processOrderUpdate));
      await orderStorage.callOnFilled();
    }
    await promiseTracker.waitForAll();
  };

  return {
    createOrders: (...args) => promiseTracker.addPromise(createOrders(...args)),
    updateOrders: (filter, update) =>
      promiseTracker.addPromise(updateOrders(filter, update)),
    runOrderManager: (onFilled, isRunning: () => boolean) =>
      promiseTracker.addPromise(runOrderManager(onFilled, isRunning)),
  };
};
