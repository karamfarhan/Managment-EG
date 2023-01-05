import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./auth-slice";

const store = configureStore({
  reducer: {
    authReducer: AuthSlice.reducer,
  },
});

export default store;
