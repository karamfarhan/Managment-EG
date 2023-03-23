import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//GET CARS
export const getCars = createAsyncThunk(
  "get/carts",
  async (arg, { dispatch }) => {
    try {
      const res = await fetch(`${window.domain}cars/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg}`,
        },
      });

      return await res.json();
    } catch (err) {
      console.log(err);
    }
  }
);

// CARS PAGINATION
export const carsPaginations = createAsyncThunk(
  "get/carsPagination",
  async (arg) => {
    try {
      const res = await fetch(`${window.domain}cars?page=${arg.page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

// CARS SEARCH
export const carsSearch = createAsyncThunk("car/search", async (arg) => {
  try {
    const res = await fetch(`${window.domain}cars/?search=${arg.search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${arg.token}`,
      },
    });
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
});
// CARS SEARCH
export const carsSearchPagination = createAsyncThunk(
  "car/searchPagination",
  async (arg) => {
    try {
      const res = await fetch(
        `${window.domain}/cars/?page=${arg.page}&search=${arg.search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);
const carSlice = createSlice({
  name: "cars",
  initialState: { data: null, isLoading: false },
  extraReducers: {
    [getCars.pending]: (state, action) => {
      state.data = action.payload;
      state.isLoading = true;
    },
    [getCars.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    [getCars.rejected]: (state, action) => {
      state.isLoading = false;
    },

    //pagination

    [carsPaginations.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    //search

    [carsSearch.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    //search pagination

    [carsSearchPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
  },
});
export default carSlice;
