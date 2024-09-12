import TaskRunner from '../../components/tasks/TaskRunner';
import Header from 'apps/frontend/components/header/Header';
import { BACKEND_WS_URL } from '@arbitrage/env';

export default function RootLayout() {
  return (
    <>
      <Header />
      <TaskRunner backendWsUrl={BACKEND_WS_URL} />
    </>
  );
}
