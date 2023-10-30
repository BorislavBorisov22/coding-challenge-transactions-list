import { Action, Actions, Transaction } from "../types";

type WalletState = { address: string } | null;

export interface RootState {
  transactions: Transaction[];
  wallet: WalletState;
  transactionModal: {
    loading: boolean;
    isOpen: boolean;
  };
}

// Initial state
const initialState: RootState = {
  transactions: [],
  wallet: null,
  transactionModal: {
    loading: false,
    isOpen: false,
  },
};

const reducer = (state = initialState, action: Action): RootState => {
  switch (action.type) {
    case Actions.SetTransactionModalState:
      return {
        ...state,
        transactionModal: {
          ...state.transactionModal,
          ...action.payload,
        },
      };

    case Actions.ConnectWalletSuccess:
      return {
        ...state,
        wallet: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
