Извините за недоразумение. Вот обновленный вариант с восстановленными изображениями:

# Руководство по крипто-боту

Для начала нужно заполнить файл `.env` необходимыми данными. Пример заполнения (некорректные данные) находится в файле `.env-example`.

Давайте двигаться постепенно. Сначала запустим алгоритм в тестовой сети, а потом в основной. (Учтите, что тестовая сеть менее стабильна по сравнению с основной — иногда она может разорвать соединение без видимых причин.)

## Кошелек
Здесь необходимо указать публичный адрес и приватный ключ вашего кошелька:
```
PRIVATE_KEY ='xxx'
WALLET_ADDRESS = '0xXXX'
```
Например, в MetaMask приватный [ключ можно найти здесь](https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/how-to-export-an-accounts-private-key/#:~:text=On%20the%20'Account%20details'%20page,to%20display%20your%20private%20key.)

## Тестовая сеть
Для начала установите значение `USE_TEST_NET` на `true`:
```
USE_TEST_NET = 'true'
```

### HyperLiquid TESTNET

Пополните счет на сумму более 0.001 ETH в сети ARBITRUM.

Получите тестовые токены по [этой ссылке](https://www.alchemy.com/faucets/arbitrum-sepolia), войдя через Alchemy и введя адрес счета, на котором есть 0.001 ETH в основной сети ARBITRUM.

Затем перейдите на [HyperLiquid testnet](https://app.hyperliquid-testnet.xyz/trade) и нажмите `Enable Trading` (эта кнопка находится справа вместо `Buy/Sell`). После подтверждения и перехода на сеть HyperLiquid **не нажимайте** `Deposit`. Закройте окно и перейдите по [этой ссылке](https://app.hyperliquid-testnet.xyz/drip), чтобы получить mock USDC. Нажмите кнопку "Claim 100 mock USDC".

Проверьте баланс на главной странице [здесь](https://app.hyperliquid-testnet.xyz/trade/TAO). Внизу страницы нажмите "Transfer to Perps", чтобы убедиться, что токены получены. 
<img width="248" alt="Screenshot 2024-09-12 at 20 05 18" src="https://github.com/user-attachments/assets/66ad9ef1-f191-4a90-976e-ea9a9413bf44">
После этого вы сможете торговать на платформе и выставлять ордера без проблем.

### Bybit TESTNET
Зарегистрируйтесь на [Bybit testnet](https://testnet.bybit.com/app/terms-service/information).

Запросите тестовые токены BTC по [этой ссылке](https://www.bybit.com/en/help-center/article/How-to-Request-Test-Coins-on-Testnet).

Переведите BTC на Perps:
<img width="248" alt="Screenshot 2024-09-12 at 20 35 19" src="https://github.com/user-attachments/assets/594c4c2d-a44a-4199-8970-788538f46038">

После этого перейдите на [Bybit Perp Testnet](https://testnet.bybit.com/trade/usdt/TAOUSDT), пройдите верификацию и попробуйте начать торги.

Для продолжения необходимо получить API-ключи Bybit по [этой ссылке](https://testnet.bybit.com/app/user/api-management) и заполнить их в файле:
```
BYBIT_API_KEY_TEST = ''
BYBIT_API_SECRET_TEST = ''
```

## Запуск алгоритма в консоли
Теперь попробуем запустить приложение в консоли.

Для начала нужно установить подходящую версию `Node.js`. Рекомендуется использовать `nvm` для этого ([macOS](https://formulae.brew.sh/formula/nvm) | [Ubuntu](https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/) | [GitHub](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)).

Далее установите менеджер пакетов Node.js — `npm` [по этой инструкции](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Теперь установите необходимые зависимости:
```
nvm use && npm i -g npx && npm i
```

Запустите консольное приложение:
```
npx nx run console:serve
```

Консольное приложение запустит файл `apps/console/src/main.ts`, который инициирует алгоритм. После успешного запуска можно проверить ордера на Bybit и Hyperliquid TAO Perp Testnet. Для завершения работы приложения нажмите `ctrl+c`.
