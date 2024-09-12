export type Filter<Data> = (data: Data) => boolean;

export const and = <Data>(...conditions: Filter<Data>[]): Filter<Data> => {
  return (data: Data): boolean => {
    return conditions.every((condition) => condition(data));
  };
};

export const or = <Data>(...conditions: Filter<Data>[]): Filter<Data> => {
  return (data: Data): boolean => {
    return conditions.some((condition) => condition(data));
  };
};

export const not = <Data>(condition: Filter<Data>): Filter<Data> => {
  return (data: Data): boolean => {
    return !condition(data);
  };
};
