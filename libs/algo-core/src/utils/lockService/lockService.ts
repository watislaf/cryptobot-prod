export const createLockService = <T>() => {
  const locks: Map<T, Promise<any>> = new Map();

  const acquire = async <R>(
    key: T,
    operation: () => Promise<R>
  ): Promise<R> => {
    const currentLock = locks.get(key);

    if (currentLock) {
      await currentLock;
    }

    const newLock = operation().finally(() => {
      locks.delete(key);
    });

    locks.set(key, newLock);
    return await newLock;
  };

  return { acquire };
};

export type LockService<T> = ReturnType<typeof createLockService<T>>;
