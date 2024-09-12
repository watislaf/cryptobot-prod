import { loginController, taskController } from './routes';
import { t } from './trpc';

export const appRouter = t.router({
  tasks: taskController,
  login: loginController,
});

export type AppRouter = typeof appRouter;
