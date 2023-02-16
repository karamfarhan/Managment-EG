import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//POST
export const createInstruments = createAsyncThunk(
  "create/instruments",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}/instruments/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
        body: JSON.stringify({
          name: arg.name,
          last_maintain: arg.last_maintain,
          maintain_place: arg.maintain_place,
          description: arg.description,
        }),
      });
      // if (arg.authenticated === true ) {
      //   ThunkAPI.dispatch(getInstruments(arg.token));
      // }

      return await res.json();
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
      const res = await fetch(`${window.domain}/instruments/`, {
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

//DELETE
export const deleteInstruments = createAsyncThunk(
  "delete/subs",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}/instruments/${arg.id}/`, {
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
        `${window.domain}/instruments/?page=${arg.page}`,
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
        `${window.domain}/instruments/?search=${arg.search}`,
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
        `${window.domain}/instruments/?page=${arg.page}&search=${arg.search}`,
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
const instrumentsSlice = createSlice({
  name: "instruments",
  initialState: {
    data: null,
    isLoading: false,
  },

  extraReducers: {
    [getInstruments.pending]: (state, action) => {
      state.data = action.payload;
      state.isLoading = true;
    },
    [getInstruments.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [getInstruments.rejected]: (state) => {
      state.isLoading = false;
    },

    //pagination
    [instrumentsPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },

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
