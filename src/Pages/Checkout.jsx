import NavBarForCheckout from '../Components/NavBarForCheckout/NavBarForCheckout';
import OrderDetailsComponent from '../Components/OrderDetails/OrderDetailsComponent';
import './Pages.css'
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/config";
import { formatSuccessMessage , formatErrorMessage } from "../utils/responseFormatter";
import DescriptionShimmer from "../Components/Shimmer/DescriptionShimmer";
import CartItemCheckoutDetails from '../Components/CartItemCeckoutDetails/CartItemCheckoutDetails.jsx';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from  '../Hooks/useAuth.js'
import { useDispatch } from 'react-redux';
import { setItemtoCart , clearCart} from '../Slices/cartSlice.js'
import ScrollToTop from '../Components/ScrollToTop/ScrollToTop.jsx';
import OrderItemDetails from '../Components/OrderItemDetails/OrderItemDetails.jsx';
import { setCategoryListValues } from "../Slices/categorySlice.js";
import { setBrandItemValues } from "../Slices/brandSlice.js";
import StripeProvider from '../Components/Stripe/StripeProvide.jsx';
import FullPageShimmer from '../Components/Shimmer/FullPageShimmer.jsx';

const Checkout = () =>{

  const [cartItemToyDetailsList , setCartItemToyDetailsList] = useState(null)
  const {isLoggedIn , userDetails} = useAuth();
  const dispatch = useDispatch();
  const [cartItems , setCartItems] = useState(null);
   const [categoryList , setCategoryList] = useState([]);
   const [brandList , setBrandList] = useState([]);
   const token = sessionStorage.getItem('token')

   async function callFetchCartDetailsApi(){
      try{
          const response = await fetch(API_BASE_URL + `cartItem/get/user/${userDetails.userId}`,{
            method:'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

           if(!response.ok){
                const errorCode = response.status;
                switch(errorCode){
                    case 401:
                      return formatErrorMessage(401 , 'Unauthorized');
                    case 403:
                       return formatErrorMessage(403 , 'Forbidden');

                }
            }

          const result = await response.json();

          if(result.status === 'success'){
              return formatSuccessMessage(200 , 'cart item list fetched successfully' ,result.data);
          }
          else if(result.status === 'error'){
              const errorCode = result.statusCode;
              console.log(result.message);
              switch(errorCode){
                  case 400:
                  return formatErrorMessage(400 ,'Please check the user id');
                  case 500:
                      return formatErrorMessage(500 ,'Error in getting cart item list');
                  default:
                      return formatErrorMessage(errorCode ,result.message);
              }
          }
      }
      catch(error){
          return error;
      }
    }


  async function fetchCartItems(){
    try{
      const result = await callFetchCartDetailsApi();
       if(result.status === 'success'){
          setCartItems(result.data)
           dispatch(setItemtoCart(result.data));
       }
       else if(result.status === 'error'){
          if(result.errorCode === 401 || result.errorCode === 403){
                toast.error('Please login to get cart item details');
                return;
            }
         toast.error('Failed to get cart item details')
       }
    }
    catch(error){
      console.log(error);
      toast.error('Please refresh the page')
    }
       
  }

  useEffect(()=>{
    if(isLoggedIn){
       fetchCartItems();
    }
    else{
       dispatch(clearCart())
    }
  },[isLoggedIn])


    async function fetchToydetails(toyIdList){
    try
       {
            const response = await fetch(API_BASE_URL +'toy/getList' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toyIdList)
            });

            const result = await response.json();
        
            if(result.status === 'success'){
                return formatSuccessMessage(201 , 'Toy List Details fetched successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Failed to fetch toy list details.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    function getToyIdList(){
       return cartItems.map((item) => item.toyId);
    }

    async function fetchCategories(){
        try{
            const response = await fetch(API_BASE_URL + `category/getAll`);
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Categories details list fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting categories details list');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function fetchBrands()
    {
        try{
            const response = await fetch(API_BASE_URL + `brand/getAll`);
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Brand details list fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting brand details list');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    useEffect(() =>{
       async function callFetchToydetails(){
            let toyIdList = {
                toyIdList : getToyIdList()
            }
            try{
                const result = await fetchToydetails(toyIdList);
                if(result.status === 'success'){
                    setCartItemToyDetailsList(result.data);
                }
                else{
                    console.log(result);
                    toast.error('Failed to get toy details')
                }
            }
            catch(error){
                console.log(error);
                toast.error('Please try again')
            }
        }
        if(cartItems){
            if(cartItems.length > 0){
               callFetchToydetails();
            }
            else{
                setCartItemToyDetailsList([])
            }
        }
        
        
    },[cartItems])

    useEffect(()=>{
        let error;
         async function callFetchCategoryApi(){
            try{
                var result = await fetchCategories();
                if(result.status === 'success'){
                    setCategoryList(result.data)
                    dispatch(setCategoryListValues(result.data))
                }
                else{
                    error = true;
                }
            }
            catch(error){
                console.log(error);
                error = true;
            }
        }
        async function callFetchBrandApi(){
            try{
                var result = await fetchBrands();
                if(result.status === 'success'){
                    setBrandList(result.data)
                    dispatch(setBrandItemValues(result.data))
                }
                else{
                    error = true;
                }
            }
            catch(error){
                console.log(error);
                error = true;
            }
        }

        callFetchCategoryApi();
        callFetchBrandApi();

        if(error){
            console.log(error);
            error = false;
        }

    },[])

    if(cartItemToyDetailsList === null || (cartItems.length > 0 && cartItemToyDetailsList.length == 0 )) return (
        <div className="cart-container">
            <FullPageShimmer />
        </div>
    )

    return (
    <>
    <StripeProvider>
        <ScrollToTop />
       <NavBarForCheckout />
       <div className='checkout-outer-container'>
           <div className='checkout-left-container'>
                <OrderDetailsComponent cartItemToyDetailsList = {cartItemToyDetailsList} cartItemList = {cartItems}/>
           </div>
           <div className='checkout-right-container'>
                <CartItemCheckoutDetails cartItemToyDetailsList = {cartItemToyDetailsList} cartItemList = {cartItems} userDetails = {userDetails} isCart={false}/>
                <OrderItemDetails cartItemToyDetailsList = {cartItemToyDetailsList} cartItemList = {cartItems} categoryList= {categoryList} brandList = {brandList}/>
           </div>
       </div>
    </StripeProvider>
    </>
    )
}
export default Checkout;