import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getInvoices = createAsyncThunk(
  "createInvoice/data",
  async (arg) => {
    try {
      const res = await fetch(`${window.domain}/invoices/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      });

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {}
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    data: null,
    isLoading: false,
  },
  extraReducers: {
    [getInvoices.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getInvoices.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    [getInvoices.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export default invoiceSlice;
