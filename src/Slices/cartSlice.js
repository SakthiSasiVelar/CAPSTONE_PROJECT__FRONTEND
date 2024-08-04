import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    items:[]
}

const itemSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addItemToCart : (state,action) =>{
            state.items.push(action.payload)
        },

        removeItemFromCart : (state,action) => {
            const itemId = action.payload;
            state.items = state.items.filter((item)=>item.toyId!== itemId);
        },

        updateItemQuantity : (state,action) => {
            const newQuantity = action.payload.quantity;
            const item = state.items.find((item)=>item.toyId === action.payload.toyId);

            if(item){
                item.quantity = newQuantity;
            }
        },

        setItemtoCart : (state,action) => {
            state.items = action.payload;
        },

        clearCart : (state) => {
            state.items = [];
        }
    }
});

export const { addItemToCart , removeItemFromCart , updateItemQuantity , clearCart , setItemtoCart } = itemSlice.actions;

export default itemSlice.reducer;