import { z } from 'zod';
import { SymbolBasicZ } from '@arbitrage/algo-types';

export const TaskParamsZ = z.object({
  currency: SymbolBasicZ,
  spread: z.number(),
  tokens: z.number(),
});
