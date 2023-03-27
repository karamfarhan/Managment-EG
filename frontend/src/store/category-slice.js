import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const getCategories = createAsyncThunk(
  "get/categories",
  async (arg, ThunkAPI) => {
    const response = await axios.get(`${window.domain}category`, {
      headers: { Authorization: `Bearer ${arg}` },
    });

    const data = await response.data;
    return data;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: [],
    isLoading: false,
  },
  extraReducers: {
    [getCategories.pending]: (state) => {
      state.isLoading = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
      console.log(action.payload);
    },
    [getCategories.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default categorySlice;
