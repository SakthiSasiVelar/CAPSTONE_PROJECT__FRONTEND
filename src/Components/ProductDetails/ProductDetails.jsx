import './ProductDetails.css';
import {Rate} from 'antd';
import { IoBagHandleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../../Slices/cartSlice';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/config';
import { formatErrorMessage , formatSuccessMessage } from '../../utils/responseFormatter';
import { useNavigate } from 'react-router-dom';

const ProductDetails = (props) =>{
    const dispatch = useDispatch();
    const toyDetails = props.toyDetails;
    const categoryList = props.categoryList;
    const brandList = props.brandList;
    const reviewList = props.reviewList;
    const {isLoggedIn , userDetails} = useSelector((store)=>store.user)
    const cartItems = useSelector((store)=>store.cart.items);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token')


    const brandName = getBrandName();
    const categoryName = getCategoryName();
    const minAge = getMinAge();
    const avgRatings = getAvgRatings();

    let discountPercent = parseInt(toyDetails.discount);
    var discountedPrice ;
    if(discountPercent > 0){
       discountedPrice = Math.floor((parseInt(toyDetails.price) - ((parseInt(toyDetails.price) * discountPercent)/100)));
    }

    function getBrandName(){
        return brandList.find(brand => brand.brandId === toyDetails.brandId).brandName;
    }

    function getCategoryName(){
        return categoryList.find(category => category.categoryId === toyDetails.categoryId).categoryName;
    }

    function getMinAge(){
        return toyDetails.ageRange.split('-')[0];
    }

    function getAvgRatings(){
        let totalRatings = reviewList.reduce((sum, review) => sum + parseInt(review.ratings), 0);
        return totalRatings / reviewList.length;
    }

    async function callAddCartItemApi(cartItemDetails){
         try
       {
            const response = await fetch(API_BASE_URL +'cartItem/add' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cartItemDetails)
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
                return formatSuccessMessage(201 , 'Item added in cart successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Error in adding cart item.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    function isCartItemAlreadyAvailable(currentItem){
       return cartItems.find((item)=>item.toyId === currentItem.toyId)
    }

    const handleAddToCart = async()=>{
         let newCartItem = {
            toyId: toyDetails.toyId,
            quantity : 1
        }
        if(isCartItemAlreadyAvailable(newCartItem)){
            toast.error('Product already in cart');
            return;
        }
        if(isLoggedIn){
            
            let addCartItmeDetails = {
                userId: userDetails.userId,
                toyId: toyDetails.toyId,
                quantity: 1
            }
            try{
               const result = await callAddCartItemApi(addCartItmeDetails);
               if(result.status === 'success'){
                  dispatch(addItemToCart(result.data));
                  toast.success('Product added successfully');
                  return true;
               }
               else{
                if(result.errorCode === 401 || result.errorCode === 403){
                    toast.error('Please login');
                    return false;
                }
                  toast.error('Failed to add product');
                  return false;
               }
            }
            catch(error){
                console.log(error);
                toast.error('Failed to add product');
                return false;
            }   
        }
        else{
            toast.error('Please login to add product');
            return;
        }
    }
   
    async function handleBuyNow(){
        if(!isLoggedIn){
            toast.error('Please login to buy product');
            return;
        }
        const result = await handleAddToCart();
        if(result)navigate('/cart')
        
    }


    return (
        <div className='product-details-outer-container'>
            <div className='brand-name-label'>{brandName}</div>
            <div className='toy-name-label'>{toyDetails.name}</div>
            <div className='age-category-outer-container'>
                <div>{minAge}Y+ </div>
                <div>|</div>
                <div>{categoryName}</div>
            </div>
            <div className='avg-review-container'>
                <Rate allowHalf defaultValue={avgRatings} />
                <span >({reviewList.length} {reviewList.length <= 1 ? 'review' : 'reviews'})</span>
            </div>
            <div className='description-container'>
                {toyDetails.description}
            </div>

            <div className='price-container'>
                {
                    discountPercent > 0  ? 
                    <>
                        <div className='original-price'>MRP <s > ₹ {parseInt(toyDetails.price)}</s></div>
                        <div><span className='discounted-price'>₹ {discountedPrice}</span></div>
                        <div><span className='discount-percent'>Save {discountPercent}%</span></div>
                    </> :
                    <>
                    <div><span className='discounted-price'><span className='original-price'>MRP</span> ₹ {parseInt(toyDetails.price)}</span></div>
                    </>
                }
            </div>
            {toyDetails.quantity > 0 ? 
               <div className='in-stock-outer-container'>
                    <div className='in-stock-container'>
                        In Stock  
                    </div>  
                    {toyDetails .quantity <= 3 && 
                    <div className='stock-remaining-container'>
                        only {toyDetails.quantity} remaining
                    </div>}
                </div>
                :
                <div className='out-stock-container'>
                     Out of Stock
                </div>
            }

         {toyDetails.quantity > 0 &&    <div className='bag-button-container'>
                <div className='add-to-cart-button' onClick={handleAddToCart}>
                     <div>Add To Cart</div>
                     <IoBagHandleSharp />
                </div>
               
                <div className='buy-now-button' onClick={handleBuyNow}>
                     <div>Buy Now</div>
                     <IoBagHandleSharp />
                </div>
             
            </div>
         }
            
            
        </div>
    )
}

export default ProductDetails;