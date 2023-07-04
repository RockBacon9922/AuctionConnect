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
import { configureStore } from "@reduxjs/toolkit";
import bidSlice from "~slices/bid-slice";
import { localStorage } from "redux-persist-webextension-storage";

const rootReducer = bidSlice;

const persistConfig = {
  key: "root",
  version: 1,
  storage: localStorage,
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
export const persistor = persistStore(store);

// This is what makes Redux sync properly with multiple pages
// Open your extension's options page and popup to see it in action
new Storage().watch({
  [`persist:${persistConfig.key}`]: () => {
    persistor.resync();
  },
});
