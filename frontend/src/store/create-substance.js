import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const createSubs = createAsyncThunk("create/subs", async(arg)=> {


    const res = await fetch('http://127.0.0.1:8000/substances/', {
        method : 'POST',
        headers : {
            'Content-type' : 'application/json',
            'Authorization' : `Bearer ${arg.token}`
        },
        body : JSON.stringify({
            name : arg.name,
            category : arg.category,
            unit_type : arg.unitType,
            description : arg.description
        })
    })

    const data = await res.json()
    console.log(data)

})

//slice

const createSubSlice = createSlice({
    name : 'substances', 
    initialState : {
        data : null
    },

})