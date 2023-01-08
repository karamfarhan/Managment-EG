import { configureStore } from "@reduxjs/toolkit";
import storeSlice from "./create-store-slice";

const store = configureStore({
  reducer: {
    storeSlice: storeSlice.reducer,
  },
});

export default store;
