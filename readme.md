# Coding Challenge Transactions List

This file contains screenshots of the final solution of the coding task for Colony as well as a documentation going through each point from the task and explaining the solution and reason behind it.


## Desktop

https://github.com/BorislavBorisov22/coding-challenge-transactions-list/assets/20156662/87a67b0f-679c-4175-adc1-a4ab39f0690f


## Mobile

https://github.com/BorislavBorisov22/coding-challenge-transactions-list/assets/20156662/6b227c99-eb18-4f45-9506-d0790756fa09

## Challenges
1. **GraphQL Query** - the issue was simply a non existent field being fetched from the `GetAllTransactions` query -> `reciept`

2. **Wallet Connection**

 The problem here was that web3-onboard requires a wallets array to be provided that contains walletInit functions through which the library seems to connect to the wallets - in our case we had to provide the injectedModule from `injected-wallets` which contains the mechanism to detect browser available wallets, in our case - metamask. I did a bit of refactoring here as well:
 
  Since the connection of the wallet requires performing a side effect, to be more consistent I went ahead and extracted a new saga/effect function to `sagas` called connectWallet and introduced new Actions (`ConnectWallet`, `ConnecWalletSuccess`) and updated the reducer and redux state to also store the relevant metamask wallet information after a successful connection to the wallet is made. This gave us the additional benefit of having a single source of truth for the wallet and read the wallet info inside the Navigation and also for populating the Send Transaction Form.

3. **Redux Saga (Investigate and fix the `SEND_TRANSACTION` saga)**

 The main problem here was that the hardcoded value for the transaction was in wei which ended up being too large of a number to be precisely represented as a raw javascript number. There seemed to be different solutions available here but what I did was just pass in the value as a string instead of a number.

4. **Navigation and Redirection**
 
  Once the transaction was successful inside the `sendTransaction` saga I added a call to the `navigate` function coming from the naive router implementation. Ideally there would be a lot more and better options some of them include passing the router object/navigation function as a context to the sagas or using a redux-react-router library that would allow dispatching actions for changing the location but this required a lot of configuration and to keep it simple I went with a straight call to the `navigate` function inside the send transaction sage.

5. **Wire in the Form**
 
   Here I used the `useForm` hook from react-hook-form and it's utilities to easily validate and keep track of the state of the form. I did the following steps:
 
    5.1 Read the sender address from the connected wallet (available in the redux state so I could just do `useSelector`).
 
    5.2 Introduce new redux state (actions, reducers) for the transaction modal's loading and open/close state. I did that so the sagas (send transaction saga) would also be able to open/close and set loading state of the modal when form is submitted successfully.
 
    5.3 Wire up each of the fields through the `register` method from useForm (keep sender address disabled as we don't want to change that and want to always send the transaction from the connected wallet's address).
 
    5.5 Introduce validation rules:
    
        * `recipient address` - to be a valid wallet address (using the ethers utility library)
    
        * `amount` - valid numeric, required value
    5.6 On successful submit dispatch a `SEND_TRANSACTION_ACTION` and pass in the form data as a payload
    
    5.7. Update the send transaction saga to get the `to` and `value` values from the action's payload instead of passing a hardcoded value and a random address.

https://github.com/BorislavBorisov22/coding-challenge-transactions-list/assets/20156662/fa51e317-2064-4527-9340-0774d0c68e81


7. **UI**

 Investigating the issue it seemed it could be solved in a lot of ways - the simplest would be to remove the `hidden` class which was only applied for devices below `sm` and would hide the button. But looking further it seemed the intention was not to just show the `connect` button at all times but rather hide it in a toggleable menu for mobile by using the tailwind utility classes for collapse expand functionality. This required to include an addtional `@preline/collapse` package in order to work properly and also adding a toggle button inside the navigation component that would only be visible for mobile devices (below `sm`).



https://github.com/BorislavBorisov22/coding-challenge-transactions-list/assets/20156662/12102714-59ff-4396-b1e6-9a1651a9ee10


8. **Human Readable Values**
 
 For the formatting I introduced a new `EthersFormtter` component that utilises the `ethers` library and allows converting from any ethereum unit to another. Then I used that component on both the transaction list and the single transaction page. It could have been just a utility function instead of a component but I find it easy to use this way.

<img width="855" alt="image" src="https://github.com/BorislavBorisov22/coding-challenge-transactions-list/assets/20156662/7a1238b2-a735-4c0d-876a-559e14e59142">

9. **Other improvements**

   9.1 Fixed the `Transactions List` title link to lead to the transactions list page instead of getting to a 404 page.
   
   9.2 Improved typescript support for the actions and reducers - added a type for each actions so that when we are inside the reducer we could have full type safety for the payload as the type of the action gets narrowed by the action type.
   
   9.3 Introduced type safe version of `useDispatch` and `useSelector` where we would have type safety and be sure to only dispatch valid actions and access valid state fields.
   
   9.4 Remove repetitive code for configuring the redux store. Inside `src/index.ts` the same logic that lives in `store/store.ts` was used but the `store.ts` code was not imported anywhere so I got rid of the `index.ts` code that was configuring the store and directly imported the configured store from `store/store.ts`  
   9.5 (not implmented but a suggestion) Extract constants for all the copy/text instead of it being hardcoded.
   9.6 (not implmented but a great suggestion)Update sagas to yield function calls by `yield call(someFn, ...args)` so that the sagas become a lot more testable without additional mock setup) and there seem to be some async tasks that do not depend on each other and could be run in parallel and awaited together.
