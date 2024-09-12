import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '@arbitrage/algo-api';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import * as http from 'node:http';
import { FRONTEND_URL } from '@arbitrage/env';
import { AlgoEventType, getAlgoEventEmitter } from '@arbitrage/logger';
import { createContext } from '../../../libs/algo-api/src/lib/trpc';

const restServer = express();

restServer.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

restServer.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

restServer.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const server = http.createServer(restServer);

const wsServer = new WebSocketServer({ server });

wsServer.on('connection', (ws) => {
  //telegramService.sendToAllUsers('Client connected')

  const algoEventEmitter = getAlgoEventEmitter();
  const logEventListener = (data: any) => {
    if (data.logType === 'error') {
      // telegramService.sendToAllUsers(data.message);
    }
    ws.send(JSON.stringify(data));
  };

  const statusEventListener = (data: any) => {
    ws.send(JSON.stringify(data));
  };

  algoEventEmitter.on(AlgoEventType.LOG, logEventListener);
  algoEventEmitter.on(AlgoEventType.STATUS, statusEventListener);

  ws.on('close', () => {
    console.log('Client disconnected');

    algoEventEmitter.off(AlgoEventType.LOG, logEventListener);
    algoEventEmitter.off(AlgoEventType.STATUS, statusEventListener);
  });

  ws.on('error', (err) => {
    const errorMessage = {
      type: 'error',
      data: `WebSocket error: ${err.message}`,
    };

    //telegramService.sendToAllUsers(errorMessage);

    console.error('WebSocket error:', err.message);
  });
});

server.listen(8080, () => {
  console.log('Server is running');
});
