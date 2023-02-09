import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateToken } from "./auth-slice";

//GET
export const getEmpolyees = createAsyncThunk(
  "get/empolyees",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/employees/", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg}`,
        },
      });
      console.log(arg);
      return await res.json();
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
      const res = await fetch(
        `http://127.0.0.1:8000/employees/?page=${arg.page}`,
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
export const empolyeeSearch = createAsyncThunk(
  "search/empolyees",
  async (arg) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/employees/?search=${arg.search}`,
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
        `http://127.0.0.1:8000/employees/?page=${arg.page}&search=${arg.search}`,
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
  },
  reducers: {},
  extraReducers: {
    [getEmpolyees.pending]: (state, action) => {},
    [getEmpolyees.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [getEmpolyees.rejected]: (state, action) => {
      state.unAuth = action.payload;
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
