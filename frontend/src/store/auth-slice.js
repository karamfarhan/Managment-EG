import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//Login
export const login = createAsyncThunk("login/token", async (arg) => {
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
    return await response.json();

    // if (!response.ok) {
    //   throw new Error(data.detail);
    // }
  } catch (err) {
    console.log(err.message);
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
    msg: "",
    user: "",
    token: localStorage.getItem("token-management") || "",
    refresh: localStorage.getItem("refresh-token") || "",
    isLoading: false,
    error: "",
    isAuth: localStorage.getItem("token-management") ? true : false,
  },
  reducers: {
    addToken: (state) => {
      state.token = localStorage.getItem("token-management");
    },
    logout: (state) => {
      state.token = null;
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
      console.log(state.refresh);
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
    },
  },
});
export const { addToken, logout } = authSlice.actions;
export default authSlice;
