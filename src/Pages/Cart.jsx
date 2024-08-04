import { useEffect, useState } from "react";
import CartItemDetails from "../Components/CartItemDetails/CartItemDetails";
import { API_BASE_URL } from "../utils/config";
import { formatSuccessMessage , formatErrorMessage } from "../utils/responseFormatter";
import { useSelector } from "react-redux";
import CartItemCheckoutDetails from "../Components/CartItemCeckoutDetails/CartItemCheckoutDetails";
import CartImageShimmer from "../Components/Shimmer/CartImageShimmer";
import DescriptionShimmer from "../Components/Shimmer/DescriptionShimmer";
import NotLoggedInImage from '../assets/Images/NotLoggedInImage.jpg'

const Cart = () => {
    const cartItems = useSelector((store) => store.cart.items);
    const [cartItemToyDetailsList , setCartItemToyDetailsList] = useState(null)
    const {isLoggedIn ,userDetails} = useSelector((store) => store.user);

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
                    toast.error('Please refresh the page')
                }
            }
            catch(error){
                console.log(error);
                toast.error('Please try again')
            }
        }
        if(cartItems.length > 0){
            callFetchToydetails();
        }
        else{
            setCartItemToyDetailsList([])
        }
        
    },[cartItems])


    if(!isLoggedIn) {
        return (
            <div className="not-logged-in-label">
                <div>LOGIN TO VIEW BAG</div>
                <img src={NotLoggedInImage} />
            </div>
        )
    }

    if(cartItemToyDetailsList === null || (cartItems.length > 0 && cartItemToyDetailsList.length == 0 )) return (
        <div className="cart-container">
            <div className="card-left-container">
                <CartImageShimmer />
            </div>
            <div>
                <DescriptionShimmer />
                <DescriptionShimmer />
            </div>
        </div>
    )


    return (
        <div className="cart-container">
            {cartItems.length <= 0 ? 
            <div className="empty-cart-label">
                <div>YOUR CART IS EMPTY</div>
                <img src={'https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png?f=webp'} className="empty-cart-image"/>
            </div> : <>
                <div className="cart-left-container">
                    <CartItemDetails cartItemToyDetailsList = {cartItemToyDetailsList} cartItemList = {cartItems} userDetails = {userDetails}/>
                </div>
                <div className="cart-right-container">
                    <CartItemCheckoutDetails  cartItemToyDetailsList = {cartItemToyDetailsList} cartItemList = {cartItems} userDetails = {userDetails} isCart={true}/>
                </div>
            </>
            }
        </div>
    )
};

export default Cart;