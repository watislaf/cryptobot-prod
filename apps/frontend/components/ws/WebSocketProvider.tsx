import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { AlgoEventPayloads } from '@arbitrage/logger';

type WebSocketContextType = {
  lastMessage: wsMessage | null;
  connectionStatus: 'connecting' | 'open' | 'closed' | 'error';
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

type wsMessage = AlgoEventPayloads[keyof AlgoEventPayloads];

export const WebSocketProvider = ({
  url,
  children,
}: {
  url: string;
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<wsMessage | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<WebSocketContextType['connectionStatus']>('connecting');

  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    const ws = new WebSocket(url);
    console.log('Connecting to WebSocket:', url);

    ws.onopen = () => {
      setConnectionStatus('open');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(
        event.data
      ) as AlgoEventPayloads[keyof AlgoEventPayloads];
      setLastMessage(message);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      setConnectionStatus('closed');
      // Attempt to reconnect after a delay
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      reconnectTimeout.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    setSocket(ws);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [url]);

  return (
    <WebSocketContext.Provider value={{ lastMessage, connectionStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
