import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    toyIdList : []
}


const toyListSlice = createSlice({
    name:'exceedCartItemQuantity',
    initialState,
    reducers:{
        setExceedCartItemQuantity : (state,action) => {
            state.toyIdList = action.payload
        },

        removeExceedCartItemQuantityId : (state,action) =>{
            if( state.toyIdList && state.toyIdList.length > 0){
                state.toyIdList =  state.toyIdList.filter((id)=>id !== action.payload)
            }
        },

        clearExceedCartItemQuantityIdList : (state) => {
            state.toyIdList = []
        }
    }
})

export const { setExceedCartItemQuantity , removeExceedCartItemQuantityId  , clearExceedCartItemQuantityIdList} = toyListSlice.actions;

export default toyListSlice.reducer;