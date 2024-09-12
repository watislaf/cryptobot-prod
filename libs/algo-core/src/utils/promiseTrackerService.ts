export interface PromiseTrackerService {
  addPromise: <T>(promise: Promise<T>) => Promise<T>;
  waitForAll: () => Promise<any>;
}

export const createPromiseTrackerService = (): PromiseTrackerService => {
  const promises = new Set<Promise<any>>();

  const addPromise = async <T>(promise: Promise<T>): Promise<T> => {
    promises.add(promise);
    return promise.finally(() => {
      promises.delete(promise);
    });
  };

  const waitForAll = () => Promise.all(promises);

  return { addPromise, waitForAll };
};
