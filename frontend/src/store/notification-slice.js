import {  createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
    name : 'notification', 
    initialState : {
        notification : null
    },
    reducers : {
        showNotification : (state, action)=>{
            state.notification = {
                status : action.payload.status,
                header : action.payload.header,
                message : action.payload.message
            }
        },
        hideNotification : (state, action)=>{
            state.notification = null;
        },
    }
})

export const notificationAction = notificationSlice.actions
export default notificationSlice
