import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Login
export const login = createAsyncThunk("login/token", async (arg, {rejectWithValue}) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/account/login_token/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },

      body: JSON.stringify({
        email: arg.email,
        password: arg.password,
      }),
    });

    if (!response.ok) {
      return rejectWithValue(response.statusText);
    }
    return await response.json();
  
  } catch (err) {
    throw rejectWithValue(err.message)
  }
});

//refresh token
export const updateToken = createAsyncThunk("refresh/token", async (arg) => {
  fetch("http://127.0.0.1:8000/account/token/refresh/", {
    method: "POST",
    body: JSON.stringify({ refresh: arg }),
    headers: {
      "Content-type": "Application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        localStorage.setItem("token-management", data.access);
      });
    }
  });
});

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
    isAuth: localStorage.getItem("token-management") ? true : false,
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
      console.log(action);
      state.httpErr = action.payload;
      console.log(state.httpErr)
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.httpErr = action.payload;
      console.log(state.httpErr)

    },
  },
});
export const { addToken, logout } = authSlice.actions;
export default authSlice;
