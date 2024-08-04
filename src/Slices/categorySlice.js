import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    categoryList:[]
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategoryListValues: (state, action) => {
            state.categoryList = action.payload;
        },
    }
});

export const { setCategoryListValues } = categorySlice.actions;

export default categorySlice.reducer;