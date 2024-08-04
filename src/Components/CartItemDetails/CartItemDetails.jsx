import './CartItemDetails.css'
import { useDispatch , useSelector } from 'react-redux';
import { formatErrorMessage , formatSuccessMessage } from '../../utils/responseFormatter';
import { API_BASE_URL } from '../../utils/config';
import { updateItemQuantity , removeItemFromCart} from '../../Slices/cartSlice'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {removeExceedCartItemQuantityId} from '../../Slices/exceedCartItemQuantitySlice'


const CartItemDetails = (props) => {
    const cartItemToyDetailsList = props.cartItemToyDetailsList;
    const cartItemList = props.cartItemList;
    const dispatch = useDispatch();
    const exceedQuantityToyList = useSelector((store)=>store.exceedCartItemQuantity.toyIdList)
    const token = sessionStorage.getItem('token');

    let newCartList = cartItemList.map((item) => {
        let cartItemToyDetails = cartItemToyDetailsList.find((toyDetails) => toyDetails.toyId === item.toyId);
        return {
            cartItemToyDetails: cartItemToyDetails,
            toyId : item.toyId,
            quantity: item.quantity,
            cartItemId : item.cartItemId
        }
    });


    function isExceedItem(id){
        if( exceedQuantityToyList && exceedQuantityToyList.length > 0){
            return exceedQuantityToyList.includes(id);
        }
        else{
            return false;
        }

    }

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

    async function updateCartItemQuantityApi(updateCartItemDetails){
       try
       {
            const response = await fetch(API_BASE_URL +'cartItem/update' , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                },
                body: JSON.stringify(updateCartItemDetails)
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
                return formatSuccessMessage(201 , 'Cart Item quantity updated successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , ' Updating Cart Item quantity failed.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function deleteCartItemApi(cartItemId){
        try
       {
            const response = await fetch(API_BASE_URL +'cartItem/delete/'+cartItemId , {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                },
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
                return formatSuccessMessage(200 , 'Cart Item  deleted successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , ' Deleting Cart Item failed.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

     const handleQuantityAdd = (item) => async()=>{
        let updateCartItemDetails = {
            cartItemId : item.cartItemId,
            userId : props.userDetails.userId,
            toyId : item.toyId,
            quantity : item.quantity + 1
        }
        try{
            const result = await updateCartItemQuantityApi(updateCartItemDetails);
            if(result.status ==='success'){
                const resultItem = result.data;
                let storeCartItem = {
                    cartItemId: resultItem.cartItemId,
                    toyId: resultItem.toyId,
                    quantity: resultItem.quantity
                }
                dispatch(updateItemQuantity(storeCartItem))
                toast.success('Product updated successfully')
            }
            else if(result.status === 'error'){
                if(result.errorCode === 603){
                    toast.error('Cannot add more than the stock')                   
                }
                else{
                    if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to  update quantity!');
                        return;
                    }
                    toast.error('Failed to add quantity');
                }
            }
        }
        catch(error){
            console.log(error);
             toast.error('please refresh the page');
        }
    }

    const handleQuantityMinus = (item) => async()=>{
        if(item.quantity <= 1){
            try{
                const result = await deleteCartItemApi(item.cartItemId);
                if(result.status ==='success'){
                    dispatch(removeExceedCartItemQuantityId(item.toyId))
                    dispatch(removeItemFromCart(item.toyId))
                    toast.success('Product removed successfully')
                }
                else{
                     if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to remove product');
                        return;
                    }
                   toast.error('Failed to remove product. Please try again');
                   console.log(result);
                }
            }
            catch(error){
                toast.error('Failed to remove product. Please try again');
                console.log(result);
            }
        }
        else{
            let updateCartItemDetails = {
                cartItemId : item.cartItemId,
                userId : props.userDetails.userId,
                toyId : item.toyId,
                quantity : item.quantity - 1
            }
            try{
                const result = await updateCartItemQuantityApi(updateCartItemDetails);
                if(result.status ==='success'){
                    const resultItem = result.data;
                    let storeCartItem = {
                        cartItemId: resultItem.cartItemId,
                        toyId: resultItem.toyId,
                        quantity: resultItem.quantity
                    }
                    if(!resultItem.isQuantityExceed){
                       dispatch(removeExceedCartItemQuantityId(item.toyId))
                    }
                    dispatch(updateItemQuantity(storeCartItem))
                    toast.success('Product updated successfully')
                }
                else if(result.status === 'error'){
                      if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to update quantity');
                        return;
                    }
                    toast.error('Failed to update quantity');
                }
            }
            catch(error){
                console.log(error);
                toast.error('please refresh the page');
            }
        }
    }
        

    return (
        <div className='cart-item-details-container'>
           <div className='cart-item-details-title'>In your bag</div>
           {
            newCartList.map((item , index) => {
             return (  <div  key={item.cartItemId}>   
                <div className='cart-item-value-outer-container'>
                    <div className='cart-item-value-container'>
                        <div className='cart-item-image-container'>
                            <img src={item.cartItemToyDetails.imageUrl} className='cart-item-image' />
                        </div>
                        <div className='cart-item-info-container'>
                            <div className='cart-item-inner-container'>
                                <div className='cart-item-brand-name'>{item.cartItemToyDetails.brandName}</div>
                                <div className='cart-item-name'>{item.cartItemToyDetails.name}</div>
                                <div className='cart-item-quantity-button-container'>
                                    <div className='add-minus-btn' onClick={handleQuantityMinus(item)}>
                                        -
                                    </div>
                                    <div className='cart-item-quantity-label'>
                                        {item.quantity}
                                    </div>
                                    <div className='add-minus-btn' onClick={handleQuantityAdd(item)}>+</div>
                                </div>
                            </div>
                            <div className='cartItem-price-container'>

                                {isExceedItem(item.toyId) ?  <div className='Quantity-Exceed-message'>Quantity Exceeded</div> : 
                                <div className='cart-item-price'> <span className='cart-item-price-mrp'>MRP </span>₹ {getCartItemPrice(item.cartItemToyDetails.discount,item.cartItemToyDetails.price , item.quantity)} </div> }
                                                              
                            </div>
                            
                        </div>
                    </div>
                </div>
                {index != newCartList.length - 1 && <hr className='cart-item-hr-line' />}
             </div>
             )
            })
           }
        </div>
    )
}

export default CartItemDetails;