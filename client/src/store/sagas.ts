import { put, takeEvery } from "redux-saga/effects";
import {
  Transaction,
  TransactionResponse,
  TransactionReceipt,
  BrowserProvider,
  Signer,
  ethers,
} from "ethers";
import injectedModule from "@web3-onboard/injected-wallets";
import Onboard from "@web3-onboard/core";

import apolloClient from "../apollo/client";
import { Actions, SendTransactionAction } from "../types";
import { SaveTransaction } from "../queries";
import { navigate } from "../components/NaiveRouter";

function* sendTransaction({ payload }: SendTransactionAction) {
  // this could have been passed along in a more elegant fashion,
  // but for the purpouses of this scenario it's good enough
  // @ts-ignore
  const walletProvider = new BrowserProvider(window.web3.currentProvider);
  const signer: Signer = yield walletProvider.getSigner();

  const transaction = {
    to: payload.recipientAddress,
    value: ethers.parseUnits(payload.amountInEth.toString(), "ether"),
  };

  try {
    yield put({
      type: Actions.SetTransactionModalState,
      payload: {
        loading: true,
      },
    });
    const txResponse: TransactionResponse = yield signer.sendTransaction(
      transaction
    );
    const response: TransactionReceipt = yield txResponse.wait();

    const receipt: Transaction = yield response.getTransaction();

    const variables = {
      transaction: {
        gasLimit: (receipt.gasLimit && receipt.gasLimit.toString()) || "0",
        gasPrice: (receipt.gasPrice && receipt.gasPrice.toString()) || "0",
        to: receipt.to,
        from: receipt.from,
        value: (receipt.value && receipt.value.toString()) || "",
        data: receipt.data || null,
        chainId: (receipt.chainId && receipt.chainId.toString()) || "123456",
        hash: receipt.hash,
      },
    };

    yield apolloClient.mutate({
      mutation: SaveTransaction,
      variables,
    });
    navigate(`/transaction/${receipt.hash}`);
  } catch (error) {
    alert(JSON.stringify(error));
  } finally {
    yield put({
      type: Actions.SetTransactionModalState,
      payload: {
        loading: false,
        isOpen: false,
      },
    });
  }
}
function* connectWallet() {
  // injected module from injected wallets allows onboard to detect browser injected wallets such as metamask
  // found by the error and then looking into the injected wallets docs - https://onboard.blocknative.com/docs/wallets/injected

  const injected = injectedModule();

  const onboard = Onboard({
    wallets: [injected],
    chains: [
      {
        id: "123456",
        token: "ETH",
        label: "Local Ganache",
        rpcUrl: "http://localhost:8545",
      },
    ],
  });

  // @ts-ignore
  const wallets = yield onboard.connectWallet();

  const [metamaskWallet] = wallets;

  if (
    metamaskWallet.label === "MetaMask" &&
    metamaskWallet.accounts[0].address
  ) {
    yield put({
      type: Actions.ConnectWalletSuccess,
      payload: { address: metamaskWallet.accounts[0].address },
    });
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.SendTransaction, sendTransaction);
  yield takeEvery(Actions.ConnectWallet, connectWallet);
}
