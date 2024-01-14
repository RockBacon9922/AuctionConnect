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
import platformSlice, { type Platforms } from "~slices/platform-slice";
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
    void persister.resync();
  },
});

export interface AppState {
  auction: Auction;
  platform: Platforms;
}
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
/**
 *
 * @RockBacon9922
 * @description Function for non React components to get the current state of the store.
 * @returns {AppState} The current state of the store
 */
export const getState = () => store.getState() as AppState;
