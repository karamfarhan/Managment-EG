import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// POST
export const createSubs = createAsyncThunk("create/subs", async (arg) => {
  const res = await fetch("http://127.0.0.1:8000/substances/", {
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
      units:arg.quantity
    }),
  });

  const data = await res.json();
});

// GET
export const getSubs = createAsyncThunk("get/subs", async (arg) => {
try{
    const res = await fetch("http://127.0.0.1:8000/substances/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${arg}`,
        },
      });
    
      const data = await res.json();
      return data
}catch(err){
    console.log(err)
}
});

//slice

const createSubSlice = createSlice({
  name: "substances",
  initialState: {
    data: null,
  },

  extraReducers : {
  
    [getSubs.pending] : (state, action)=> {
        console.log(state)
    },
    [getSubs.fulfilled] : (state, action)=> {
        state.data = action.payload;
        console.log(action.payload)
    },
    [getSubs.rejected] : (state, action)=> {
        console.log(state)
    },
  }
});
export default createSubSlice