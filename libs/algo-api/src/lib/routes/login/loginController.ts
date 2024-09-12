import { z } from 'zod';
import { t } from '../../trpc';
import { BACKEND_URL, generateRandomString } from '@arbitrage/env';

export const apiKey = generateRandomString(20);
console.log('Your secret password is: ' + apiKey);

export const loginController = t.router({
  signin: t.procedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const isValidKey = input.password === apiKey;
      if (isValidKey) {
        ctx.res.cookie('apiKey', apiKey, {
          httpOnly: true,
          secure: BACKEND_URL.startsWith('https'),
          sameSite: 'strict',
        });
        return { success: true };
      } else {
        return { success: false };
      }
    }),
});
