import { configureStore } from "@reduxjs/toolkit";
import instrumentsSlice from "./create-instruments";
import invoiceSlice from "./create-invoice-slice";
import storeSlice from "./create-store-slice";
import  createSubSlice  from "./create-substance";
import notificationSlice from "./notification-slice";
import images_slice from "./upload-img-slice";

const store = configureStore({
  reducer: {
    storeSlice: storeSlice.reducer,
    imageReducer: images_slice.reducer,
    notificationRed : notificationSlice.reducer,
    subsReducer : createSubSlice.reducer,
    instrumentsReducer : instrumentsSlice.reducer,
    invoiceReducer : invoiceSlice.reducer
  },
});

export default store;
