import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Action } from "@remix-run/router";

export const authAction = createAsyncThunk(
  "auth/login",
  async (arg, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/login_token/",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },

          body: JSON.stringify({
            email: arg.email,
            password: arg.password,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }
      console.log(data);
      return {
        data,
        access: data.access,
        refresh: data.refresh,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const AuthSlice = createSlice({
  name: "authentication",
  initialState: {
    user: localStorage.getItem("access_token") || null,
    refresh: null,
    err: null,
    isLoading: null,
  },

  extraReducers: {
    [authAction.pending]: (state, action) => {
      state.isLoading = true;
    },
    [authAction.fulfilled]: (state, action) => {
      state.err = null;
      localStorage.setItem("access_token", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);
      state.isLoading = false;
      state.user = localStorage.getItem("access_token");
      state.refresh = localStorage.getItem("refresh");
      console.log(action);
    },
    [authAction.rejected]: (state, action) => {
      state.err = action.payload;
      state.isLoading = false;
    },
  },

  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh");

      state.user = null;
      state.refresh = null;
    },
  },
});

export const authAct = AuthSlice.actions;

export default AuthSlice;
