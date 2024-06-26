import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getStores = createAsyncThunk(
  "createStore/data",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}/stores/`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg}`,
        },
      });
      // if (res.status === 401) {
      //   return ThunkAPI.dispatch(logout());
      // }
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);
export const createStore = createAsyncThunk(
  "createStore/data",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}/stores/`, {
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
      if (arg.authenticated === true) {
        ThunkAPI.dispatch(getStores(arg.token));
      }
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
      const res = await fetch(`${window.domain}/stores/?page=${arg.page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      });
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
    const res = await fetch(`${window.domain}/stores/?search=${arg.search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${arg.token}`,
      },
    });
    const data = await res.json();
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
        `${window.domain}/stores/?page=${arg.page}&search=${arg.search}`,
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

const storeSlice = createSlice({
  name: "store",
  initialState: {
    store_data: null,
    isLoading: false,
  },
  extraReducers: {
    [getStores.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getStores.fulfilled]: (state, action) => {
      state.store_data = action.payload;
      state.isLoading = false;
    },
    [getStores.rejected]: (state, action) => {
      state.isLoading = false;
    },

    //pagination
    [storePagination.pending]: (state, action) => {},
    [storePagination.fulfilled]: (state, action) => {
      state.store_data = action.payload;
    },
    [storePagination.rejected]: (state, action) => {},

    //search

    [storeSearch.pending]: (state, action) => {},
    [storeSearch.fulfilled]: (state, action) => {
      state.store_data = action.payload;
    },
    [storeSearch.rejected]: (state, action) => {},

    //search pagination
    [storeSearchPagination.pending]: (state, action) => {},
    [storeSearchPagination.fulfilled]: (state, action) => {
      state.store_data = action.payload;
    },
    [storeSearchPagination.rejected]: (state, action) => {},
  },
});

export default storeSlice;
