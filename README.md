Oto przetłumaczony tekst na rosyjski:

---

# Crypto bot manual

Сначала нужно заполнить файл `.env` данными. Пример данных (не валидных) находится в `.env-example`.

Начнем постепенно. Сначала запустим алгоритм на тестовой сети, а затем на основной сети. (Тестовая сеть нестабильна по сравнению с основной сетью, иногда она без причины разрывает соединение)

# Wallet
Здесь вставляем публичный адрес и приватный ключ нашего кошелька.
```
PRIVATE_KEY ='xxx'
WALLET_ADDRESS = '0xXXX'
```
Например, в MetaMask приватный [ключ можно найти здесь](https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/how-to-export-an-accounts-private-key/#:~:text=On%20the%20'Account%20details'%20page,to%20display%20your%20private%20key.)

# Testnet
Сначала устанавливаем USE_TEST_NET на true.
```
USE_TEST_NET = 'true'
```

## HyperLiquid TESTNET

Затем пополняем счет на > 0.001 ETH в сети ARBITRUM.

Запрашиваем баланс тестовыми токенами [здесь](https://www.alchemy.com/faucets/arbitrum-sepolia). Нужно войти через Alchemy и ввести адрес счета, на котором 0.001 ETH в основной сети ARBITRUM.

Далее заходим на [hyperliquid testnet](https://app.hyperliquid-testnet.xyz/trade) и нажимаем `Enable Trading` справа, где обычно кнопка `Buy/Sell`. После подтверждения и перехода на HyperLiquid network не нажимаем `Deposit`, закрываем и идем (здесь)[https://app.hyperliquid-testnet.xyz/drip], чтобы получить mock USDC. Нажимаем второй сверху кнопкой "Claim 100 mock USDC".

Теперь проверим, удалось ли нам пополнить баланс mock токенами. Заходим на (главную страницу)[https://app.hyperliquid-testnet.xyz/trade/TAO]. Внизу нажимаем "Transfer to Perps" <img width="248" alt="Screenshot 2024-09-12 at 20 05 18" src="https://github.com/user-attachments/assets/66ad9ef1-f191-4a90-976e-ea9a9413bf44">. На (странице)[https://app.hyperliquid-testnet.xyz/trade/TAO] мы должны иметь возможность торговать. Мы можем выставить новый ордер и закрыть его без проблем.

## Bybit TESTNET
Регистрируемся на [Bybit testnet](https://testnet.bybit.com/app/terms-service/information).

Нажимаем [request testnet tokens](https://www.bybit.com/en/help-center/article/How-to-Request-Test-Coins-on-Testnet), чтобы получить mock BTC.

Переносим BTC на Perps: <img width="248" alt="Screenshot 2024-09-12 at 20 35 19" src="https://github.com/user-attachments/assets/594c4c2d-a44a-4199-8970-788538f46038">

Заходим на [bybit perp testnet](https://testnet.bybit.com/trade/usdt/TAOUSDT) и проходим верификацию. После этого пробуем торговать.

Нам нужно собрать Bybit API ключи [отсюда](https://testnet.bybit.com/app/user/api-management).

И заполнить их здесь:
```
BYBIT_API_KEY_TEST = ''
BYBIT_API_SECRET_TEST = ''
```

## Run algo in console
Теперь попробуем запустить приложение в консоли.

Сначала нужно установить подходящую версию `Node.js`. Для этого используем `nvm` ([macos](https://formulae.brew.sh/formula/nvm) | [ubuntu](https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/) | [официальный github](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script).

Затем устанавливаем Node.js package manager `npm` [официальная ссылка](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Теперь устанавливаем пакеты:
```
nvm use && npm i -g npx && npm i
```

И запускаем консольное приложение:
```
npx nx run console:serve
```

Консольное приложение запускает файл `apps/console/src/main.ts`, внутри которого запускается алгоритм. Если приложение запустилось, можно проверить, появились ли ордера на Bybit и Hyperliquid TAO perp Testnet. Чтобы завершить работу приложения, нужно нажать ctrl+c.

---
