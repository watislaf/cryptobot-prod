# Crypto bot manual

Najpier musimy uzupełnić plik `.env` z danymi. Przykład danych (nie walidnych) jest w `.env-example`. 

Zaczniemy powoli. Uruchomimy algorytm na testnecie a później na main necie. (Test net jest nie stabilny w odróżnieniu od mainnet, czasami on bez powodu zrywa połączenie)


# Wallet
Tutaj wklejamy publiczny adres oraz prywatny klucz naszego portfelu. 
```
PRIVATE_KEY ='xxx'
WALLET_ADDRESS = '0xXXX'
```
Na przykładzie metamaska prywatny [klucz można znaleźć tutaj](https://support.metamask.io/managing-my-wallet/secret-recovery-phrase-and-private-keys/how-to-export-an-accounts-private-key/#:~:text=On%20the%20'Account%20details'%20page,to%20display%20your%20private%20key.)

# Testnet
Najpierw ustawiamy USE_TEST_NET na true.
```
USE_TEST_NET = 'true'
```
Dalej doładowujemy konto na > 0.001 ETH na ARBITRUM network.

Popełniamy swój balans testowymi tokenami [tutaj](https://www.alchemy.com/faucets/arbitrum-sepolia). Trzeba zalogować się poprzez Alchemy i wpisać adres konta na którem jest 0.001 ETH na ARBITRUM mainnet network.

Dalej wchodzimy na [hyperliquid testnet ](https://app.hyperliquid-testnet.xyz/trade)  i klikamy `Enable Trading` po prawej stronie gzie zazwyczaj jest przycisk `Buy/Sell`. Po zaakceptowaniu i przenoszeniu się na HyperLiquid network Nie klikamy `Deposit` , zamykami i idziemy na 

BYBIT_API_KEY_TEST = ''
BYBIT_API_SECRET_TEST = ''
