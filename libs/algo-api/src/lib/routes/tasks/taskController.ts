import { z } from 'zod';
import { protectedProcedure, t } from '../../trpc';
import { taskService } from './tasksService';
import { TaskParamsZ } from './taskDto';
import {
  Amount,
  Percent,
  SymbolBasic,
  SymbolBasicZ,
} from '@arbitrage/algo-types';

export const castToEnum = <T extends Record<string, string>>(
  enumObj: T,
  value: string
): T[keyof T] | undefined => {
  if (SymbolBasicZ.safeParse(value).success) {
    return enumObj[value as keyof T];
  }
  return undefined;
};

export const taskController = t.router({
  run: protectedProcedure.input(TaskParamsZ).mutation(async ({ input }) => {
    const currency = castToEnum(SymbolBasic, input.currency);
    if (!currency) {
      throw new Error('Invalid currency');
    }
    await taskService.run({
      currency,
      spread: input.spread as Percent,
      tokens: input.tokens as Amount,
      savedLogs: [],
    });
  }),

  stop: protectedProcedure.input(z.object({})).mutation(async () => {
    await taskService.stop();
  }),

  getStatus: protectedProcedure.input(z.object({})).query(() => {
    return taskService.getStatus();
  }),
});
