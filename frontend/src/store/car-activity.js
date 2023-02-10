import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//pagination

export const getCarPagination = createAsyncThunk(
  "get/carsPagination",
  async (arg) => {
    try {
      const res = await fetch(
        `${window.domain}/cars/${arg.id}/activity/?page=${arg.page}`,
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
