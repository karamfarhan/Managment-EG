import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./auth-slice";

//GET CARS
export const getCars = createAsyncThunk(
  "get/carts",
  async (arg, { dispatch }) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/cars/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg}`,
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      if (res.status === 401) {
        return dispatch(logout());
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return dispatch(logout());
    }
  }
);

// CARS PAGINATION
export const CarsPaginations = createAsyncThunk(
  "get/carsPagination",
  async (arg) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/cars/?page=${arg.page}`, {
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
  }
);

// CARS SEARCH
export const CarsSearch = createAsyncThunk("car/search", async (arg) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/cars/?search=${arg.search}`,
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
});
// CARS SEARCH
export const CarsSearchPagination = createAsyncThunk(
  "car/searchPagination",
  async (arg) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/cars/?page=${arg.page}&search=${arg.search}`,
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
  initialState: { data: null },
  extraReducers: {
    [getCars.fulfilled]: (state, action) => {
      state.data = action.payload;
    },

    //pagination

    [CarsPaginations.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    //search

    [CarsSearch.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    //search pagination

    [CarsSearchPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
  },
});
export default carSlice;
