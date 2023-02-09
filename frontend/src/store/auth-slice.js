import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Login
export const login = createAsyncThunk(
  "login/token",
  async (arg, { rejectWithValue, dispatch }) => {
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
  async (arg, { dispatch }) => {
    const res = await fetch("http://127.0.0.1:8000/account/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: arg }),
      headers: {
        "Content-type": "Application/json",
      },
    });

    if (res.status === 401) {
      return dispatch(logout());
    }

    return await res.json();
  }
);

//create slice
const authSlice = createSlice({
  name: "login",
  initialState: {
    httpErr: "",
    msg: "",
    user: "",
    token: localStorage.getItem("token-management") || null,
    refresh: localStorage.getItem("refresh-token") || null,
    isLoading: false,
    isAuth: localStorage.getItem("token-management") !== null ? true : false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.refresh = null;
      localStorage.clear();
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
      localStorage.setItem("token-management", action.payload.access);
      localStorage.setItem("refresh-token", action.payload.refresh);
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.httpErr = action.payload;
    },

    [updateToken.fulfilled]: (state, action) => {
      state.token = action.payload.access;

      localStorage.setItem("token-management", action.payload.access);
    },
  },
});
export const { addToken, logout } = authSlice.actions;
export default authSlice;
