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
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
});
export const createStore = createAsyncThunk(
  "createStore/data",
  async (arg, ThunkAPI) => {
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
      //ThunkAPI.dispatch(getStores(arg.token))
    } catch (err) {
      console.log(err);
    }
  }
);

//store pagination
export const storePagination = createAsyncThunk(
  "store/pagination",
  async (arg) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/stores/?page=${arg.page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }
);

//search
export const storeSearch = createAsyncThunk("store/search", async (arg) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/stores/?search=${arg.search}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      }
    );
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err.message);
  }
});

//search pagination

export const storeSearchPagination = createAsyncThunk(
  "store/search",
  async (arg) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/stores/?page=${arg.page}&search=${arg.search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }
);

const storeSlice = createSlice({
  name: "store",
  initialState: {
    store_data: null,
  },
  extraReducers: {
    [getStores.pending]: (state, action) => {},
    [getStores.fulfilled]: (state, action) => {
      state.store_data = action.payload;
      console.log(action);
    },
    [getStores.rejected]: (state, action) => {},

    //pagination
    [storePagination.pending]: (state, action) => {},
    [storePagination.fulfilled]: (state, action) => {
      state.store_data = action.payload;
      console.log(action);
    },
    [storePagination.rejected]: (state, action) => {},

    //search

    [storeSearch.pending]: (state, action) => {},
    [storeSearch.fulfilled]: (state, action) => {
      state.store_data = action.payload;
      console.log(action);
    },
    [storeSearch.rejected]: (state, action) => {},

    //search pagination
    [storeSearchPagination.pending]: (state, action) => {},
    [storeSearchPagination.fulfilled]: (state, action) => {
      state.store_data = action.payload;
      console.log(action);
    },
    [storeSearchPagination.rejected]: (state, action) => {},
  },
});

export default storeSlice;
