import { Dollar } from '@arbitrage/algo-types';

export enum ErrorExampleType {
  InsufficientFunds,
}

export type ExampleErrorMap = {
  [ErrorExampleType.InsufficientFunds]: ExampleErrorData;
};

type ExampleErrorData = {
  exampleVar: Dollar;
  secondExampleVar: Dollar;
};
