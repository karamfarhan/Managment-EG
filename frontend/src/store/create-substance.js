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

    const data = await res.json();
    console.log(data);
    return data;
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

      const data = await res.json();
      console.log(data);
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

      const data = await res.json();
      console.log(data);
      return data;
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

    const data = await res.json();

    return data;
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
      const data = await res.json();
      console.log(data);
      return data;
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
  },

  extraReducers: {
    [getSubs.pending]: (state, action) => {
      console.log(state);
    },
    [getSubs.fulfilled]: (state, action) => {
      state.data = action.payload;
      console.log(action.payload);
    },
    [getSubs.rejected]: (state, action) => {
      console.log(state);
    },

    //pagination

    [subsPagination.pending]: (state, action) => {
      console.log(state);
    },
    [subsPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
      console.log(action.payload);
    },
    [subsPagination.rejected]: (state, action) => {
      console.log(state);
    },

    //search
    [searchSubstances.pending]: (state, action) => {
      console.log(state);
    },
    [searchSubstances.fulfilled]: (state, action) => {
      state.data = action.payload;
      console.log(action.payload);
    },
    [searchSubstances.rejected]: (state, action) => {
      console.log(state);
    },
    // search pagination
    [subsSearchPagination.pending]: (state, action) => {
      console.log(state);
    },
    [subsSearchPagination.fulfilled]: (state, action) => {
      state.data = action.payload;
      console.log(action.payload);
    },
    [subsSearchPagination.rejected]: (state, action) => {
      console.log(state);
    },
  },
});
export default createSubSlice;
