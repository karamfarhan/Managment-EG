import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// POST
export const createSubs = createAsyncThunk(
  "create/subs",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}/substances/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${arg.token}`,
        },
        body: JSON.stringify({
          name: arg.name,
          category: arg.category,
          unit_type: arg.unitType,
          description: arg.description,
          units: arg.quantity,
        }),
      });
      // if (arg.authenticated === true && arg.subsViewed) {
      //   ThunkAPI.dispatch(getSubs(arg.token));
      // }

      return await res.json();
    } catch (err) {
      console.log(err);
    }
  }
);

// GET
export const getSubs = createAsyncThunk("get/subs", async (arg) => {
  try {
    const res = await fetch(`${window.domain}/substances/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${arg}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.log(err);
  }
});

//DELETE
export const deleteSubs = createAsyncThunk(
  "delete/subs",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}/substances/${arg.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      });
      ThunkAPI.dispatch(getSubs(arg.token));

      return await res.json();
      // setIsDelete(false);
    } catch (err) {}
  }
);

//pagination

export const subsPagination = createAsyncThunk(
  "delete/subs",
  async (arg, ThunkAPI) => {
    try {
      const res = await fetch(`${window.domain}/substances/?page=${arg.page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      });

      return await res.json();

      // setIsDelete(false);
    } catch (err) {}
  }
);

//SEARCH
export const searchSubstances = createAsyncThunk("get/subs", async (arg) => {
  try {
    const res = await fetch(
      `${window.domain}/substances/?search=${arg.search}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      }
    );

    return await res.json();
  } catch (err) {
    console.log(err);
  }
});

//search pagination
export const subsSearchPagination = createAsyncThunk(
  "store/search",
  async (arg) => {
    try {
      const res = await fetch(
        `${window.domain}/substances/?page=${arg.page}&search=${arg.search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${arg.token}`,
          },
        }
      );
      return await res.json();
    } catch (err) {
      console.log(err.message);
    }
  }
);

//slice

const createSubSlice = createSlice({
  name: "substances",
  initialState: {
    data: null,
    isLoading: false,
  },

  extraReducers: {
    [getSubs.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getSubs.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    [getSubs.rejected]: (state, action) => {
      state.isLoading = false;
    },

    //pagination

    [subsPagination.pending]: (state, action) => {},
    [subsPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [subsPagination.rejected]: (state, action) => {},

    //search
    [searchSubstances.pending]: (state, action) => {},
    [searchSubstances.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [searchSubstances.rejected]: (state, action) => {},
    // search pagination
    [subsSearchPagination.pending]: (state, action) => {},
    [subsSearchPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
    },
    [subsSearchPagination.rejected]: (state, action) => {},
  },
});
export default createSubSlice;
