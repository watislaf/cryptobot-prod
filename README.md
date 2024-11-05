## Hyperliquid arbitrage bot

This bot runs a strategy that is based on creation and maintenence of orders on both sides on unstable dex (hyperliquid) for a current market price +- 2%. When order on one side is filled it automatycally creates contr order on bybit (stable cex) . Perpetual orders are opened for seperate sides - thats how we use hadging. When orders will go back to normal positions are closed with profit 2%.

In current state bot can make money if proper pair and moment is found.  also hyperliquid has a cap for 16k$, after those it will increase api limit.  

# Crypto Bot Guide

To begin, fill in the `.env` file with the required data. An example with placeholder values is provided in the `.env-example` file.

Let’s proceed step-by-step. First, we’ll run the algorithm on the test network and later switch to the main network. (Note: the test network is less stable than the main one — it may occasionally disconnect without any apparent reason.)

## Wallet
Enter your wallet's public address and private key:
```
PRIVATE_KEY ='xxx'
WALLET_ADDRESS = '0xXXX'
```
For example, in MetaMask, you can find the private [key here](https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/how-to-export-an-accounts-private-key/#:~:text=On%20the%20'Account%20details'%20page,to%20display%20your%20private%20key.)

## Test Network
Start by setting `USE_TEST_NET` to `true`:
```
USE_TEST_NET = 'true'
```

### HyperLiquid TESTNET

Deposit more than 0.001 ETH in the ARBITRUM network.

Request test tokens [here](https://www.alchemy.com/faucets/arbitrum-sepolia) by logging into Alchemy and entering an address with 0.001 ETH on the ARBITRUM mainnet.

Then go to the [HyperLiquid testnet](https://app.hyperliquid-testnet.xyz/trade) and click `Enable Trading` (this button replaces `Buy/Sell` on the right). After confirming and switching to the HyperLiquid network, **do not** click `Deposit`. Close the window and go to [this link](https://app.hyperliquid-testnet.xyz/drip) to claim mock USDC. Click "Claim 100 mock USDC".

Verify your balance on the main page [here](https://app.hyperliquid-testnet.xyz/trade/TAO). At the bottom of the page, click "Transfer to Perps" to confirm the tokens are received.
<img width="248" alt="Screenshot 2024-09-12 at 20 05 18" src="https://github.com/user-attachments/assets/66ad9ef1-f191-4a90-976e-ea9a9413bf44">
After this, you’ll be able to trade and place orders on the platform without issues.

### Bybit TESTNET
Register on the [Bybit testnet](https://testnet.bybit.com/app/terms-service/information).

Request test BTC [here](https://www.bybit.com/en/help-center/article/How-to-Request-Test-Coins-on-Testnet).

Transfer BTC to Perps:
<img width="248" alt="Screenshot 2024-09-12 at 20 35 19" src="https://github.com/user-attachments/assets/594c4c2d-a44a-4199-8970-788538f46038">

Next, go to the [Bybit Perp Testnet](https://testnet.bybit.com/trade/usdt/TAOUSDT), complete verification, and try trading.

To proceed, obtain Bybit API keys [here](https://testnet.bybit.com/app/user/api-management) and fill them in:
```
BYBIT_API_KEY_TEST = ''
BYBIT_API_SECRET_TEST = ''
```

## Running the Algorithm in Console
Let’s run the application in the console.

First, install the appropriate version of `Node.js`. It’s recommended to use `nvm` ([macOS](https://formulae.brew.sh/formula/nvm) | [Ubuntu](https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/) | [GitHub](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)).

Then, install Node.js package manager `npm` [using this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Now, install the necessary dependencies:
```
nvm use && npm i -g npx && npm i
```

Run the console application:
```
npx nx run console:serve
```

The console application runs `apps/console/src/main.ts`, which initiates the algorithm. After launching successfully, you can check orders on Bybit and Hyperliquid TAO Perp Testnet. To stop the application, press `ctrl+c`.

