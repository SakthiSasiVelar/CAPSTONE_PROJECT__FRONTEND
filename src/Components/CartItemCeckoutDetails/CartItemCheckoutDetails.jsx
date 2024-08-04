import { useState , useEffect } from 'react';
import './CartItemCheckoutDetails.css'
import { CgPlayButtonO } from "react-icons/cg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatErrorMessage  , formatSuccessMessage} from '../../utils/responseFormatter';
import { API_BASE_URL } from '../../utils/config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPrice } from '../../Slices/priceSlice';
import { setExceedCartItemQuantity , clearExceedCartItemQuantityIdList } from '../../Slices/exceedCartItemQuantitySlice';

const CartItemCheckoutDetails = (props) => {
    const cartItemToyDetailsList = props.cartItemToyDetailsList;
    const cartItemList = props.cartItemList;
    const userDetails = props.userDetails;
    const [couponDiscountPrice , setCouponDiscountPrice] = useState(0);
    const[couponCode , setCouponCode] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = sessionStorage.getItem('token')

    let newCartList = cartItemList.map((item) => {
        let cartItemToyDetails = cartItemToyDetailsList.find((toyDetails) => toyDetails.toyId === item.toyId);
        return {
            cartItemToyDetails: cartItemToyDetails,
            toyId : item.toyId,
            quantity: item.quantity,
            cartItemId : item.cartItemId
        }
    })

    function getTotalPrice(allItemTotalPrice , couponDiscountPrice){
        let price = allItemTotalPrice;
        if(couponDiscountPrice > 0){
            price -= couponDiscountPrice;
        }
        if(allItemTotalPrice < 999){
            price += 40;
        }
        return price;
    }

     let allItemTotalPrice = getAllItemTotalPrice(newCartList) ;

     let totalPrice = getTotalPrice(allItemTotalPrice , couponDiscountPrice);

     useEffect(()=>{
        dispatch(setPrice(totalPrice))
     },[totalPrice])

    function getCartItemPrice(discountPercent , price , quantity){
           let discountedPrice ;
           if(discountPercent > 0){
              discountedPrice = Math.floor((parseInt(price) - ((parseInt(price) * discountPercent)/100)));
           }
           else{
              discountedPrice = parseInt(price);
           }
           return discountedPrice * quantity;
    }

    function getAllItemTotalPrice(newCartList){
        let allItemTotalPrice = 0;
        newCartList.forEach((item) => {
            allItemTotalPrice += getCartItemPrice(item.cartItemToyDetails.discount, item.cartItemToyDetails.price, item.quantity);
        })
        return allItemTotalPrice;
    }

    async function validateCouponCode(validateCouponCodeDetails){
        try
       {
            const response = await fetch(API_BASE_URL +'coupon/valid/firstOrder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(validateCouponCodeDetails)
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
                return formatSuccessMessage(200 , 'Coupon code validated successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'coupon code validation failed.Please try again');
                    case 600:
                        return formatErrorMessage(600 , result.message);
                    case 601:
                        return formatErrorMessage(601 , result.message);
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function handleApplyCoupon(){
        if(couponDiscountPrice > 0){
            toast.error('Coupon code already applied');
            return;
        }
        if(couponCode.length == 0){
            toast.error('Coupon code is required');
            return;
        }
        if(couponCode.length < 5) {
            toast.error('Enter valid coupon code');
            return;
        }
        try{
            let validateCouponCodeDetails = {
                couponCode: couponCode,
                userId : userDetails.userId
            }
            const result = await validateCouponCode(validateCouponCodeDetails);
            if(result.status ==='success'){
                setCouponDiscountPrice(result.data.discountPrice);
                toast.success('Coupon code applied successfully');
            }
            else if(result.status == 'error'){
                if(result.errorCode === 401 || result.errorCode === 403){
                    toast.error('Please login to apply coupon');
                }
                else if(result.errorCode === 600){
                    toast.error('Not a valid user ')
                }
                else if(result.errorCode === 601){
                    toast.error('Enter valid coupon code')
                }
                else{
                    toast.error('please try again');
                    console.log(result);
                }
            }
            setCouponCode('');
        }
        catch(error){
            console.log(error);
            toast.error('Please try again');
        }
    }

    async function callQuantityCheckApi(cartItemQuantityCheckDetails){
         try
       {
            const response = await fetch(API_BASE_URL +'toy/checkQuantity' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cartItemQuantityCheckDetails)
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
                return formatSuccessMessage(200 , 'cart Item quantity validated successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'cart Item quantity  validation failed.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    function handleCouponCodeChange(e){
        setCouponCode(e.target.value);
    }

    function getCartItemQuantityCheckDetails(){
       let resultList = cartItemList.map((cartItem) =>{
        return {
            toyId : cartItem.toyId,
            quantity : cartItem.quantity
        }
       })
       return resultList;
    }

    async function validCartItems(){
        let cartItemQuantityCheckDetails = getCartItemQuantityCheckDetails();
        try{
            const result = await callQuantityCheckApi(cartItemQuantityCheckDetails);
            if(result.status === 'success'){
               let exceedToyList = result.data.moreQuantityToyIdList;
               if(exceedToyList.length > 0){
                  dispatch(setExceedCartItemQuantity(exceedToyList));
                  return false;
               }
               else{
                dispatch(clearExceedCartItemQuantityIdList());
                return true;
               }
            }
            else{
                if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to checkout');
                        return;
                    }
                toast.error('Failed to checkout');
            }
        }
        catch(error){
            console.log(error);
            toast.error('Please try again');
        }
    }

    async function handleCheckout(){
        if(await validCartItems()){
           navigate('/checkout')
        }
        else{
            toast.error('Some items in the cart are out of stock');
            return;
        }
    }
    return (
        <div className='checkout-detail-container'>
            <div className='checkout-details-container'>
               <div className='checkout-detail-inner-container'>
                  <div>{newCartList.length} items</div>
                  <div>₹ {allItemTotalPrice}</div>
               </div>
               <hr className='chekout-detail-hr-line'/>
               {couponDiscountPrice > 0 && <> <div className='checkout-detail-inner-container discount'>
                  <div>Discount</div>
                  <div>- ₹{couponDiscountPrice}</div>
                </div>
                <hr className='chekout-detail-hr-line'/>
                </>
               }
              {allItemTotalPrice > 0 && allItemTotalPrice < 999 &&  <> <div className='checkout-detail-inner-container total'>
                    <div>Delivery Charge</div>
                    <div>+ ₹40</div>
                 </div>
                   <hr className='chekout-detail-hr-line'/>
               </> }
               <div className='checkout-detail-inner-container total'>
                  <div>Total</div>
                  <div>₹ {totalPrice}</div>
               </div>
            {!props.isCart &&   <div className='checkout-coupon-container coupon-message'>
                   <div className='coupon-info'>Use code- WELCOME100 for the first order</div>
               </div> }
            </div> 
            <div className='return-detail'>Free Returns within 30 Days.</div>
            <div className='return-detail'>Free Delivery on orders over Rs.999</div>
           {!props.isCart &&  <div className='coupoun-apply-container'>
                <input className='coupon-apply-inp-field' placeholder='Apply coupon code' value={couponCode} onChange={handleCouponCodeChange} />
                <CgPlayButtonO  className='couply-apply-btn' onClick={handleApplyCoupon}/>
            </div>
             }
           {props.isCart && <div className='checkout-btn-container' onClick={handleCheckout}>
                <div>Checkout</div>
            </div>
          }
        </div>
    )
}

export default CartItemCheckoutDetails;