import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "../Slices/userSlice";
import filterSliceReducer from '../Slices/filterSlice'
import categorySliceReducer from "../Slices/categorySlice";
import brandSliceReducer from "../Slices/brandSlice";
import cartSliceReducer from "../Slices/cartSlice";
import priceSliceReducer from "../Slices/priceSlice";
import exceedCartItemQuantitySliceReducer from "../Slices/exceedCartItemQuantitySlice";

const store = configureStore({
  reducer :{
    user : userSliceReducer,
    filter: filterSliceReducer,
    category: categorySliceReducer,
    brand: brandSliceReducer,
    cart: cartSliceReducer,
    price : priceSliceReducer,
    exceedCartItemQuantity: exceedCartItemQuantitySliceReducer
  }
});

export default store;