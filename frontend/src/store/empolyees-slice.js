import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "./auth-slice";

//GET
export const getEmpolyees = createAsyncThunk(
  "get/empolyees",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}employees/`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg}`,
        },
      });
      const data = await res.json();
      if (res.status === 401) {
        return ThunkAPI.dispatch(logout());
      }
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

//pagination
export const empolyeePagination = createAsyncThunk(
  "empolyee/pagination",
  async (arg) => {
    try {
      const res = await fetch(`${window.domain}employees?page=${arg.page}`, {
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
export const empolyeeSearch = createAsyncThunk(
  "search/empolyees",
  async (arg) => {
    try {
      const res = await fetch(
        `${window.domain}/employees/?search=${arg.search}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      const data = await res.json();
      return data;
    } catch (err) {}
  }
);

//search pagination

export const empolyeeSearchPagination = createAsyncThunk(
  "search-emp/pagination",
  async (arg) => {
    try {
      const res = await fetch(
        `${window.domain}/employees/?page=${arg.page}&search=${arg.search}`,
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

//slice
const empolyeeSlice = createSlice({
  name: "empolyee",
  initialState: {
    data: null,
    isLoading: true,
  },
  reducers: {},
  extraReducers: {
    [getEmpolyees.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getEmpolyees.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    [getEmpolyees.rejected]: (state, action) => {
      state.unAuth = action.payload;
      state.isLoading = false;
    },
    //pagination
    [empolyeePagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },

    //search
    [empolyeeSearch.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    //search pagination
    [empolyeeSearchPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
  },
});

export default empolyeeSlice;
