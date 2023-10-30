import { Action, Actions, Transaction } from "../types";

type WalletState = { address: string } | null;

export interface RootState {
  transactions: Transaction[];
  wallet: WalletState;
}

// Initial state
const initialState: RootState = {
  transactions: [],
  wallet: null,
};

const reducer = (state = initialState, action: Action): RootState => {
  switch (action.type) {
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
