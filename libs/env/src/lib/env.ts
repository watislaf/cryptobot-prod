const boolean = (value: string | undefined) => value === 'true';

const string = (envVarName: string) => {
  const value = process.env[envVarName];
  if (!value) {
    throw new Error(`Missing required environment variable: ${envVarName}`);
  }
  return value;
};

export const generateRandomString = (length: number): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const USE_TEST_NET = boolean(process.env.USE_TEST_NET);
export const SHOW_MORE_LOGS = boolean(process.env.SHOW_MORE_LOGS);

export const PRIVATE_KEY = string('PRIVATE_KEY');
export const WALLET_ADDRESS = string('WALLET_ADDRESS');

export const BYBIT_API_KEY = string('BYBIT_API_KEY');
export const BYBIT_API_SECRET = string('BYBIT_API_SECRET');

export const BYBIT_API_KEY_TEST = string('BYBIT_API_KEY_TEST');
export const BYBIT_API_SECRET_TEST = string('BYBIT_API_SECRET_TEST');

export const FRONTEND_URL = string('FRONTEND_URL');
export const BACKEND_URL = string('BACKEND_URL');
export const BACKEND_WS_URL = string('BACKEND_WS_URL');

export const TELEGRAM_TOKEN = string('TELEGRAM_TOKEN');
