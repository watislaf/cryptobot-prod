import { EventEmitter } from 'events';
import { Logger as PinoLogger } from 'pino';

type BaseEventPayload = { eventType: string };

export type AlgoLogEvent = AlgoEventPayloads[AlgoEventType.LOG];

export type AlgoEventPayloads = {
  [AlgoEventType.LOG]: BaseEventPayload & {
    eventType: AlgoEventType.LOG;
    logType: keyof PinoLogger;
    message: string;
  };
  [AlgoEventType.STATUS]: BaseEventPayload & {
    eventType: AlgoEventType.STATUS;
    isRunning: boolean;
  };
};

export const createTypedEventEmitter = <
  T extends Record<string, BaseEventPayload>
>() => {
  const emitter = new EventEmitter();

  return {
    emit<K extends keyof T>(payload: T[K]): boolean {
      return emitter.emit(payload.eventType as string, payload);
    },
    on<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
      emitter.on(event as string, listener);
    },
    off<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
      emitter.off(event as string, listener);
    },
    once<K extends keyof T>(event: K, listener: (payload: T[K]) => void): void {
      emitter.once(event as string, listener);
    },
  };
};

export enum AlgoEventType {
  LOG = 'log',
  STATUS = 'status',
}

const algoEventEmitter = createTypedEventEmitter<AlgoEventPayloads>();

export const getAlgoEventEmitter = () => algoEventEmitter;
