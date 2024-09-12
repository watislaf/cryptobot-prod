import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '@arbitrage/algo-api';

export const trpc = createTRPCReact<AppRouter>();
