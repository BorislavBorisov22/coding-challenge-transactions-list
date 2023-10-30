import React, { useCallback } from "react";

import SendTransaction from "./SendTransaction";
import { useDispatch } from "../store/store";
import { Actions } from "../types";
import { useSelector } from "../store/store";
import { navigate } from "./NaiveRouter";
import { ToggleIcon } from "./ToggleIcon";

const Navigation: React.FC = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector<string | null>(
    (state) => state.wallet?.address ?? null
  );

  // Moved all of the logic for connecting to the store inside redux store and the side effect as a saga, this way we have a
  // consistent way of handling side effects and also can access the connected walled from anywhere in the app just by reading the redux state
  const handleConnect = useCallback(() => {
    dispatch({ type: Actions.ConnectWallet });
  }, [dispatch]);

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-ful text-sm py-4 bg-gray-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <a
            className="flex-none text-xl font-semibold dark:text-white"
            href="."
            onClick={(ev) => {
              ev.preventDefault();
              navigate("/transactions");
            }}
          >
            Transactions List
          </a>
          <button
            type="button"
            className="hs-collapse-toggle sm:hidden py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
            id="app-main-actions-collapse"
            data-hs-collapse="#app-main-actions"
          >
            <ToggleIcon />
          </button>
        </div>

        <div
          id="app-main-actions"
          className="hs-collapse hidden overflow-hidden mt-10 transition-all duration-300 basis-full grow sm:block sm:mt-0"
          aria-labelledby="app-main-actions-toggle"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
            {walletAddress && (
              <>
                <SendTransaction />
                <p className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 text-sm">
                  {walletAddress}
                </p>
              </>
            )}
            {!walletAddress && (
              <button
                type="button"
                onClick={handleConnect}
                className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-200 font-semibold text-gray-200 hover:text-white hover:bg-gray-500 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
