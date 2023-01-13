import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//POST
export const createInstruments = createAsyncThunk(
  "create/instruments",
  async (arg, ThunkAPI) => {
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
          maintain_place: arg.maintain_place,
          description: arg.description,
        }),
      });
      ThunkAPI.dispatch(getInstruments(arg.token));
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

//DELETE
export const deleteInstruments = createAsyncThunk(
  "delete/subs",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/instruments/${arg.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      });
      ThunkAPI.dispatch(getInstruments(arg.token));

      return await res.json();

      // setIsDelete(false);
    } catch (err) {}
  }
);

//pagination

export const instrumentsPagination = createAsyncThunk(
  "delete/subs",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/instruments/?page=${arg.page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      //  ThunkAPI.dispatch(getSubs(arg.token))

      const data = await res.json();
      console.log(data);
      return data;
      // setIsDelete(false);
    } catch (err) {}
  }
);

//SEARCH
export const searchInstruments = createAsyncThunk(
  "get/instruments",
  async (arg) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/instruments/?search=${arg.search}`,
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

//search pagination
export const instrumSearchPagination = createAsyncThunk(
  "store/search",
  async (arg) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/instruments/?page=${arg.page}&search=${arg.search}`,
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

    //pagination
    [instrumentsPagination.pending]: (state) => {},
    [instrumentsPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [instrumentsPagination.rejected]: (state) => {},

    //search
    [searchInstruments.pending]: (state) => {},
    [searchInstruments.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [searchInstruments.rejected]: (state) => {},

    //search pagination
    [instrumSearchPagination.pending]: (state) => {},
    [instrumSearchPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [instrumSearchPagination.rejected]: (state) => {},
  },
});

export default instrumentsSlice;
