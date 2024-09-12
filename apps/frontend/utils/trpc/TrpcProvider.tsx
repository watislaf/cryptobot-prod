import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from './trpc';
import { useState } from 'react';
import { httpBatchLink } from '@trpc/client'; // Import based on your setup
import { useRouter, useSearchParams } from 'next/navigation'; // Assuming you're using Next.js, adjust for your routing library

export function TrpcProvider({
  children,
  backendUrl,
}: {
  children: React.ReactNode;
  backendUrl: string;
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter(); // Use router to navigate programmatically
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: backendUrl + '/trpc',
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            }).then(async (response) => {
              if (response.status === 401) {
                router.push('/login?token=' + token); // Redirect to login on 401
              }
              return response;
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
