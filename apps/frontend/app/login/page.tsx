'use client';

import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { Loader2 } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '../../components';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EnhancedLoginPage() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const loginMutation = trpc.login.signin.useMutation();
  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const result = await loginMutation.mutateAsync({ password: apiKey });

      if (result.success) {
        router.push('/tasks?token=' + token);
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (error) {
      console.log(error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ApiKey
            </label>
            <Input
              id="password"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-lg p-6"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
