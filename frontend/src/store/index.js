import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./auth-slice";
import storeSlice from "./create-store-slice";

const store = configureStore({
  reducer: {
    authReducer: AuthSlice.reducer,
    storeSlice: storeSlice.reducer,
  },
});

export default store;
