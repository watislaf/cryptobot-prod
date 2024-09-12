import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import type * as express from 'express';
import { apiKey } from './routes';

export const getCookies = (req: express.Request): string | undefined => {
  return req.headers.cookie;
};

export const parseCookies = (
  cookieHeader: string | undefined
): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);
};

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  // @ts-ignore

  const cookies = parseCookies(getCookies(req));

  return { req, res, isAuthorised: cookies['apiKey'] === apiKey };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;
  if (!ctx.isAuthorised) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {},
  });
});
