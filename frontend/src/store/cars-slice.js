import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCars = createAsyncThunk("get/carts", async (arg) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/cars/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${arg}`,
      },
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
});

const carSlice = createSlice({
  name: "cars",
  initialState: { data: null },
  extraReducers: {
    [getCars.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
  },
});
export default carSlice;
