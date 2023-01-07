import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createStore = createAsyncThunk("createStore/data", async (arg) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/stores/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${arg.token}`,
      },

      body: JSON.stringify({
        name: arg.name,
        address: arg.address,
        description: arg.description,
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText || "حدث خطأ");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
});

const storeSlice = createSlice({
  name: "store",
  initialState: {
    store_data: [],
  },
  extraReducers: {
    [createStore.pending]: (state, action) => {
      console.log(action);
    },
    [createStore.fulfilled]: (state, action) => {
      state.store_data.push(action.payload);
      console.log(action);
    },
    [createStore.rejected]: (state, action) => {
      console.log(action);
    },
  },
});

export default storeSlice;
