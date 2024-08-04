import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    brandList:[]
};

const brandSlice = createSlice({
    name:'brand',
    initialState,
    reducers:{
        setBrandItemValues:(state,action)=>{
            state.brandList = action.payload;
        },
    }
});

export const { setBrandItemValues } = brandSlice.actions;

export default brandSlice.reducer;