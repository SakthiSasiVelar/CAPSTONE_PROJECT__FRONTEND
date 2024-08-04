import { createSlice } from "@reduxjs/toolkit";


const initialState = {
   userDetails:{},
   isLoggedIn: false
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUserDetails:(state,action)=>{
            state.userDetails = action.payload;
            state.isLoggedIn = true;
            sessionStorage.setItem('token' , state.userDetails.token);
        },
        rehydrate : (state,action) => {
            state.userDetails = action.payload;
            state.isLoggedIn = true;
        },
        logout : (state)=>{
            state.userDetails = {};
            state.isLoggedIn = false;
            sessionStorage.removeItem('token');
        }
    }
});

export const { setUserDetails, rehydrate , logout} = userSlice.actions;

export default userSlice.reducer;