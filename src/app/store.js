import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import campaignReducer from "../features/campaign/campaignSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import Settings from "../config/settings.json";

// Configure persistant storage
const persistConfig = {
  key: Settings.REDUX.PERSIST_CONFIG.KEY,
  version: Settings.REDUX.PERSIST_CONFIG.VERSION,
  storage,
  whitelist: Settings.REDUX.PERSIST_CONFIG.WHITELIST,
};

// Configure the store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistReducer(persistConfig, authReducer),
    campaign: campaignReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// Export the persistant
export const persistor = persistStore(store);
