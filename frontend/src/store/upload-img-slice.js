import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationAction } from "./notification-slice";

export const uploadImgs = createAsyncThunk(
  "upload/img",
  async (arg, ThunkAPI) => {
    try {
      const formdata = new FormData();

      formdata.append("store", arg.selectVal);

      for (let i = 0; i < arg.img.length; i++) {
        formdata.append("images", arg.img[i]);
      }

      formdata.append("alt_text", arg.description);
      const res = await fetch("http://127.0.0.1:8000/images/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
        body: formdata,
      });
      const data = await res.json();
 ThunkAPI.dispatch(fetchImgs(arg));
    } catch (err) {
      console.log(err);
    }
  }
);
// fetch images
export const fetchImgs = createAsyncThunk("fetch/img", async (arg) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/images/all/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${arg.token}`,
      },
    });
    const data = await res.json();
    console.log(data)
    return data;
  } catch (err) {

    console.log(err);
  }
});


// images pagination
export const imagesPagination = createAsyncThunk("pagination/img", async (arg) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/images/all/?page=${arg.page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${arg.token}`,
      },
    });
    const data = await res.json();
    console.log(data)
    return data;
  } catch (err) {

    console.log(err);
  }
});




//search
export const searchImgs = createAsyncThunk("search/imgs", async (arg, ThunkAPI) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/images/all/?search=${arg.search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${arg.token}`,
      },

    });
    if (!res.ok) {
      throw new Error(res.statusText || "حدث خطأ");
    }
  ThunkAPI.dispatch(getStores(arg.token))

   
  } catch (err) {
    console.log(err);
  }
});
















const images_slice = createSlice({
  name: "images",
  initialState: {
    data: null,
  },
  extraReducers: {
    [fetchImgs.pending]: (state) => {
      console.log(state);
    },
    [fetchImgs.fulfilled]: (state, action) => {
      console.log(action);
      state.data = action.payload;
    },
    [fetchImgs.rejected]: (state) => {
      console.log(state);
    },






    [imagesPagination.pending]: (state) => {
      console.log(state);
    },
    [imagesPagination.fulfilled]: (state, action) => {
      console.log(action);
      state.data = action.payload;
    },
    [imagesPagination.rejected]: (state) => {
      console.log(state);
    },





  },
});

export default images_slice;
