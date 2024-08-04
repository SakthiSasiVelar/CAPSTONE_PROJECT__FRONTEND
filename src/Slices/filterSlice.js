import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    selectedFilterValues :{
        category : null,
        brand : null,
        price: null,
        age: null
    }
}

const filterSlice = createSlice({
    name:'filter',
    initialState,
    reducers:{
        setSelectedFilteredValues:(state,action)=>{
            state.selectedFilterValues = action.payload
        },
        clearFilterValues:(state)=>{
            state = initialState ;
        }
    }
});

export const {  setSelectedFilteredValues , clearFilterValues } = filterSlice.actions;

export default filterSlice.reducer;