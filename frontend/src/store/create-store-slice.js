import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";




export const getStores = createAsyncThunk("createStore/data", async (arg) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/stores/", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${arg}`,
      },
   
    });
    if (!res.ok) {
      throw new Error(res.statusText || "حدث خطأ");
    }

    const data = await res.json();
  console.log(data)
    return data;
  } catch (err) {
    console.log(err);
  }
});
export const createStore = createAsyncThunk("createStore/data", async (arg, ThunkAPI) => {
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
  ThunkAPI.dispatch(getStores(arg.token))

   
  } catch (err) {
    console.log(err);
  }
});


























const storeSlice = createSlice({
  name: "store",
  initialState: {
    store_data:null,
  },
  extraReducers: {
    [getStores.pending]: (state, action) => {
    },
    [getStores.fulfilled]: (state, action) => {
      state.store_data = (action.payload)
      console.log(action)
    },
    [getStores.rejected]: (state, action) => {
    },
    // [createStore.pending]: (state, action) => {
    // },
    // [createStore.fulfilled]: (state, action) => {
    //     state.store_data.push(action.payload)
    //     console.log(action.payload)
    // },
    // [createStore.rejected]: (state, action) => {
    // },
  },
});

export default storeSlice;
