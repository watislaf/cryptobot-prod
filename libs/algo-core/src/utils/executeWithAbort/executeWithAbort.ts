export type AbortableOperation<T> = () => Promise<T>;

export const aborted = 'aborted';
export type Aborted = typeof aborted;

export const executeWithAbort = async <T>(
  operation: AbortableOperation<T>,
  shouldAbort: () => boolean,
  checkInterval: number = 50
): Promise<T | Aborted> => {
  return new Promise<T | Aborted>(async (resolve, reject) => {
    const interval = setInterval(() => {
      if (shouldAbort()) {
        clearInterval(interval);
        resolve(aborted);
      }
    }, checkInterval);

    try {
      const result = await operation();
      clearInterval(interval);
      resolve(result);
    } catch (error) {
      clearInterval(interval);
      reject(error);
    }
  });
};

export const wasAborted = <T>(result: T | Aborted): result is Aborted =>
  result === aborted;
