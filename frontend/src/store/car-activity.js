import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./auth-slice";
//pagination

export const getCarPagination = createAsyncThunk(
  "get/carsPagination",
  async (arg, { dispatch }) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/cars/${arg.id}/activity/?page=${arg.page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      // if (res.status === 401) {
      //   return dispatch(logout());
      // }
      const data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);
const cartActivitySlice = createSlice({
  name: "cars",
  initialState: { data: null },
  extraReducers: {
    //pagination
    [getCarPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
      console.log(state.data);
    },
  },
});
export default cartActivitySlice;
