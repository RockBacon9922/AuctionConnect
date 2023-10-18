import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  RESYNC,
} from "@plasmohq/redux-persist";
import { Storage } from "@plasmohq/storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auctionSlice, { type Auction } from "~slices/auction-slice";
import platformSlice, { type Platform } from "~slices/platform-slice";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { localStorage } from "redux-persist-webextension-storage";

const rootReducer = combineReducers({
  auction: auctionSlice,
  platform: platformSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  storage: localStorage, // TODO: This is a type error. when installing the type package there is a inconsitency with the type that is expected by the persistReducer function
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          RESYNC,
        ],
      },
    }),
});
export const persister = persistStore(store);

// This is what makes Redux sync properly with multiple pages
// Open your extension's options page and popup to see it in action
new Storage({
  area: "local",
}).watch({
  [`persist:${persistConfig.key}`]: () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    persister.resync();
  },
});

export interface AppState {
  auction: Auction;
  platform: Platform[];
}

// Get the types from the mock store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
/**
 * Function that allows you to dispatch a Redux reducer action to the store
 */
export const useAppDispatch: DispatchFunc = useDispatch;
/**
 * Function that allows you to get the current state of the Redux store
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetAuction = () =>
  useAppSelector((state: AppState) => state.auction);

export const useGetCurrentLot = () => {
  const auction: Auction = useAppSelector((state: AppState) => state.auction);
  return auction.lots.find((lot) => lot.id === auction.currentLotId);
};

export const useGetPlatforms = () =>
  useAppSelector((state: AppState) => state.platform);

export const getState = () => store.getState() as AppState;
