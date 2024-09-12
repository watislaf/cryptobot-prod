import './global.css';
import { TrpcProviderWrapper } from 'apps/frontend/utils/trpc/TrpcProviderWrapper';
import { BACKEND_URL } from '@arbitrage/env';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProviderWrapper backendUrl={BACKEND_URL}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </TrpcProviderWrapper>
  );
}
