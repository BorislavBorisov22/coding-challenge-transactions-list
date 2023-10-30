export interface Transaction {
  gasLimit: string;
  gasPrice: string;
  to: string;
  from: string;
  value: string;
  data?: string;
  chainId: string;
  hash: string;
}

export interface TransactionsData {
  getAllTransactions: Transaction[];
}

export interface SingleTransactionData {
  getTransaction: Transaction;
}

// Redux related types
export enum Actions {
  SendTransaction = "SEND_TRANSACTION",
  ConnectWallet = "CONNECT_WALLET",
  ConnectWalletSuccess = "CONNECT_WALLET_SUCCESS",
}

export type ReduxAction<TType extends Actions, TPayload> = {
  type: TType;
  payload: TPayload;
};

export type SendTransactionAction = ReduxAction<
  Actions.SendTransaction,
  {
    recipientAddress: string;
    amountInEth: number;
  }
>;
type ConnectWalletAction = ReduxAction<Actions.ConnectWallet, {}>;

type ConnectWalletSuccessAction = ReduxAction<
  Actions.ConnectWalletSuccess,
  { address: string }
>;

export type Action =
  | SendTransactionAction
  | ConnectWalletAction
  | ConnectWalletSuccessAction;
