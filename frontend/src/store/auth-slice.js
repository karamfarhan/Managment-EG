import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

//Login
export const login = createAsyncThunk(
  "login/token",
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

      if (response.status === 401) {
        return rejectWithValue(response.statusText);
      }
      return await response.json();
    } catch (err) {
      throw rejectWithValue(err.message);
    }
  }
);

//refresh token
export const updateToken = createAsyncThunk(
  "refresh/token",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/account/token/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: arg }),
        headers: {
          "Content-type": "Application/json",
        },
      });
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return await res.json();
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

//create slice
const authSlice = createSlice({
  name: "login",
  initialState: {
    httpErr: "",
    msg: "",
    user: "",
    token: Cookies.get("token-management") || null,
    refresh: Cookies.get("refresh-token") || null,
    isLoading: false,
    isAuth: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refresh = null;
      Cookies.remove("token-management");
      Cookies.remove("refresh-token");
      state.isAuth = false;
    },
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.isLoading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.token = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuth = true;
      Cookies.set("token-management", action.payload.access);
      Cookies.set("refresh-token", action.payload.refresh);
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.httpErr = action.payload;
    },

    [updateToken.fulfilled]: (state, action) => {
      state.token = action.payload.access;
      state.isAuth = true;
      Cookies.set("token-management", action.payload.access);
      console.log(action);
    },
    [updateToken.rejected]: (state, action) => {
      Cookies.remove("token-management");
      Cookies.remove("refresh-token");
      state.isAuth = false;
    },
  },
});
export const { addToken, logout } = authSlice.actions;
export default authSlice;
