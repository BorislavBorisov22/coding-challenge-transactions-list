import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useDispatchRedux,
  useSelector as useSelectorRedux,
} from "react-redux";
import createSagaMiddleware from "redux-saga";

import reducer, { RootState } from "./reducers";
import { rootSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload"],
      },
    }).concat(sagaMiddleware),
});

export type Dispatch = typeof store.dispatch;
export const useDispatch = () => useDispatchRedux<Dispatch>();

export const useSelector = <T>(selector: (state: RootState) => T) =>
  useSelectorRedux(selector);

sagaMiddleware.run(rootSaga);
