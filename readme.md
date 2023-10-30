# Coding Challenge Transactions List

This file contains screenshots of the final solution of the coding task for Colony as well documentation going through each point from the task and explaining the solution and reason behind it.


## Desktop

https://github.com/BorislavBorisov22/coding-challenge-transactions-list/assets/20156662/87a67b0f-679c-4175-adc1-a4ab39f0690f


## Mobile

https://github.com/BorislavBorisov22/coding-challenge-transactions-list/assets/20156662/6b227c99-eb18-4f45-9506-d0790756fa09

## Challenges
1. **GraphQL Query** - the issues was simply a non existen field being fetched from the `GetAllTransactions` query -> `reciept`

2. **Wallet Connection** - the problem here was that web3-onboard requires a wallets array to be provided that contains walletInit functions through which the library seems to connect to the wallets - in our case we had to provide the injectedModule from `injected-wallets` which contains the mechanism to detect browser available wallets, in our case - metamask. I did a bit of refactoring here as well:

Since the connection of the wallet requires performing a side effect, to be more consistent I went ahead and extracted a new saga/effect function to `sagas` called connectWallet and introduced new Actions (`ConnectWallet`, `ConnecWalletSuccess`) and updated the reducer and redux state to also store the relevant metamask wallet information after a successful connection to the wallet is made. This gave us the additional benefit of having a single source of truth for the wallet and read the wallet info inside the Navigation and also for populating the Send Transaction Form.

3. **Redux Saga (Investigate and fix the `SEND_TRANSACTION` saga)**
The main problem here was that the hardcoded value for the transaction was in wei which ended up being too large of a number to be precisely represented as a raw javascript number. There seemed to be different solutions available here but what I did was just pass in the value as a string instead of a number.

4. **Navigation and Redirection**
 Once the transaction was successful I added a call to the `navigate` function coming from the naive router implementation. Ideally there would be a lot more and better options some of them include passing the router object/navigation function as a context to the sagas or using a redux-react-router library that would allow dispatching actions for changing the location but this required a lot of configuration and to keep it simple I went with a straight call to the `navigate` function inside the send transaction sage.

5. **Wire in the Form**
 Here I used the `useForm` hook from react-hook-form and it's utilities to easily validate and keep track of the state of the form. I did the following steps:

   5.1 Read the sender address from the connected wallet (available in the redux state so I could just do `useSelector`).

   5.2 Introduce new redux state for the transaction modal's loading and open/close state. I did that so the sagas would also be able to open/close and set loading state of the modal when form is submitted.

   5.3 Wire up each of the fields through the register method from useForm (keep sender address disabled as we don't want to change that and send it from the connected wallet).

   5.5 Introduce validation rules:
   
       * `recipient address` - to be a valid wallet address (using the ethers utility library)
   
       * `amount` - valid numeric, required value
   5.6 On successful submit dispatch a `SEND_TRANSACTION_ACTION` and pass in the form data as a payload
   5.7. Update the send transaction saga to get the `to` and `value` instead of passing a hardcoded value and a random address. Update transaction modal state based on the request state.



7. ****
