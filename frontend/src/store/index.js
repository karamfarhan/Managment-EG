import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import cartActivitySlice from "./car-activity";
import carSlice from "./cars-slice";
import instrumentsSlice from "./create-instruments";
import invoiceSlice from "./create-invoice-slice";
import storeSlice from "./create-store-slice";
import createSubSlice from "./create-substance";
import empolyeeSlice from "./empolyees-slice";
import notificationSlice from "./notification-slice";
import images_slice from "./upload-img-slice";
import categorySlice from "./category-slice";

const store = configureStore({
  reducer: {
    authReducer: authSlice.reducer,
    storeSlice: storeSlice.reducer,
    imageReducer: images_slice.reducer,
    notificationRed: notificationSlice.reducer,
    categoryReducer: categorySlice.reducer,
    subsReducer: createSubSlice.reducer,
    instrumentsReducer: instrumentsSlice.reducer,
    invoiceReducer: invoiceSlice.reducer,
    empolyeeReducer: empolyeeSlice.reducer,
    carReducer: carSlice.reducer,
    carActivityRed: cartActivitySlice.reducer,
  },
});

export default store;
