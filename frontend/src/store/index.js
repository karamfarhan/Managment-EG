import { configureStore } from "@reduxjs/toolkit";
import storeSlice from "./create-store-slice";
import notificationSlice from "./notification-slice";
import images_slice from "./upload-img-slice";

const store = configureStore({
  reducer: {
    storeSlice: storeSlice.reducer,
    imageReducer: images_slice.reducer,
    notificationRed : notificationSlice.reducer
  },
});

export default store;
