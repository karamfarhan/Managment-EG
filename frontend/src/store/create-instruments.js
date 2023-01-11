import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//POST

export const createInstruments = createAsyncThunk(
  "create/instruments",
  async (arg) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/instruments/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
        body: JSON.stringify({
          name: arg.name,
          ins_type: "Handed",
          last_maintain: arg.last_maintain,
          description: arg.description,
        }),
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

//GET
export const getInstruments = createAsyncThunk(
  "get/instruments",
  async (arg) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/instruments/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg}`,
        },
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

//slice
const instrumentsSlice = createSlice({
  name: "instruments",
  initialState: {
    data: null,
  },

  extraReducers: {
    [getInstruments.pending]: (state) => {},
    [getInstruments.fulfilled]: (state, action) => {
      state.data = action.payload;
      console.log(action.payload);
    },
    [getInstruments.rejected]: (state) => {},
  },
});

export default instrumentsSlice