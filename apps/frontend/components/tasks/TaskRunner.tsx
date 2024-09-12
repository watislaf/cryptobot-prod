'use client';
import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '..';
import { trpc } from 'apps/frontend/utils/trpc';
import { TRPCClientError } from '@trpc/client';
import { useWebSocket, WebSocketProvider } from '../ws/WebSocketProvider';
import { AlgoEventType } from '@arbitrage/logger';
import { SymbolBasic } from '@arbitrage/algo-types';
import LogsDisplay from './LogsDisplayComponent';

function TaskRunnerContent() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [spread, setSpread] = useState(1.0);
  const [tokens, setTokens] = useState(0.14);
  const [selectedCurrency, setSelectedCurrency] = useState<SymbolBasic>(
    SymbolBasic.TAO
  );
  const [spreadError, setSpreadError] = useState('');
  const [tokensError, setTokensError] = useState('');

  const { lastMessage, connectionStatus } = useWebSocket();

  const {
    data,
    isLoading: statusLoading,
    error: statusError,
  } = trpc.tasks.getStatus.useQuery({});

  useEffect(() => {
    if (!data) return;
    setIsRunning(data.isRunning);
    setSpread((data?.params?.spread || 0) * 100 || spread);
    setSelectedCurrency(data?.params?.currency || selectedCurrency);
  }, [data]);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.eventType === AlgoEventType.LOG) {
        setLogs((prev) => {
          const newLog = `[${new Date().toLocaleTimeString()}] ${
            lastMessage.logType === 'error' ? 'Error:' : ''
          } ${lastMessage.message}`;
          const updatedLogs = [...prev, newLog];
          return updatedLogs.slice(-500); // Keep only the last 500 logs
        });
      }

      if (lastMessage.eventType === AlgoEventType.STATUS) {
        setIsRunning(lastMessage.isRunning);
      }
    }
  }, [lastMessage]);

  const runTaskMutation = trpc.tasks.run.useMutation({
    onError: (error) => {
      if (
        error instanceof TRPCClientError &&
        error.message.includes('Task is already running')
      ) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Task is already running. Cannot start a new one.`,
        ]);
        setIsRunning(true);
      } else {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Error starting task: ${
            error.message
          }`,
        ]);
      }
    },
  });

  const stopTaskMutation = trpc.tasks.stop.useMutation({
    onError: (error) => {
      if (
        error instanceof TRPCClientError &&
        error.message.includes('No task is currently running')
      ) {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] No task is currently running.`,
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Error stopping task: ${
            error.message
          }`,
        ]);
      }
    },
  });

  const validateInputs = () => {
    let isValid = true;

    if (spread <= 0 || spread >= 2) {
      setSpreadError('Spread must be between 0 and 2');
      isValid = false;
    } else {
      setSpreadError('');
    }

    if (tokens <= 0) {
      setTokensError('Tokens must be greater than 0');
      isValid = false;
    } else {
      setTokensError('');
    }

    return isValid;
  };

  const runTask = () => {
    if (!validateInputs()) return;

    const params = {
      currency: selectedCurrency,
      spread: spread / 100,
      tokens,
    };
    runTaskMutation.mutate(params);
    setLogs([]);
  };

  const stopTask = () => {
    stopTaskMutation.mutate({});
  };

  if (statusLoading) {
    return <div>Loading...</div>;
  }

  if (statusError) {
    return <div>Server error...</div>;
  }

  return (
    <Card className="w-full h-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Algo Runner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spread">Spread %</Label>
            <Input
              id="spread"
              type="number"
              value={spread}
              onChange={(e) => {
                setSpread(Number(e.target.value));
                setSpreadError('');
              }}
              disabled={isRunning}
              step="0.01"
            />
            {spreadError && (
              <p className="text-red-500 text-sm">{spreadError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tokens">Tokens amount</Label>
            <Input
              id="tokens"
              type="number"
              value={tokens}
              onChange={(e) => {
                setTokens(Number(e.target.value));
                setTokensError('');
              }}
              disabled={isRunning}
              step="0.01"
            />
            {tokensError && (
              <p className="text-red-500 text-sm">{tokensError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              disabled={isRunning}
              onValueChange={(value: SymbolBasic) => setSelectedCurrency(value)}
              value={selectedCurrency}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SymbolBasic).map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <LogsDisplay logs={logs} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={runTask}
          disabled={isRunning || connectionStatus !== 'open'}
          size="lg"
        >
          Run Task
        </Button>
        <Button
          onClick={stopTask}
          disabled={!isRunning || connectionStatus !== 'open'}
          variant="destructive"
          size="lg"
        >
          Stop Task
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TaskRunner({ backendWsUrl }: { backendWsUrl: string }) {
  return (
    <WebSocketProvider url={backendWsUrl}>
      <TaskRunnerContent />
    </WebSocketProvider>
  );
}
