import { useState } from 'react';
import './OrderDetailsComponent.css';
import { API_BASE_URL } from '../../utils/config';
import { toast } from 'react-toastify';
import { useSelector  , useDispatch} from 'react-redux';
import { formatErrorMessage , formatSuccessMessage } from '../../utils/responseFormatter';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import OrderResult from '../OrderResult/OrderResult';
import { setPrice } from '../../Slices/priceSlice';
import LoadingSpinner from '../Spinner/LoadingSpinner';


const OrderDetailsComponent = (props) => {
  const totalAmount = useSelector((store) => store.price.price);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [payment, setPayment] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [pincode, setPinCode] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const userDetails = useSelector((store) => store.user.userDetails);
  const cartItemToyDetailsList = props.cartItemToyDetailsList;
  const cartItemList = props.cartItemList;
  const stripe = useStripe();
  const elements = useElements();
  let successfulPaymentId = null;
  const [orderResult , setOrderResult] = useState(null);
  const dispatch = useDispatch();
  const [isLoading , setIsLoading] = useState(false)


  const handleNameChange = (e) => setName(e.target.value);
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleContactNumberChange = (e) => setContactNumber(e.target.value);
  const handlePincodeChange = (e) => setPinCode(e.target.value);
  const handlePaymentChange = (e) => setPayment(e.target.value);
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

  const validateName = () => {
    if (name.length === 0) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  }
  const validateAddress = () => {
    if (address.length === 0) {
      setAddressError('Address is required');
      return false;
    }
    setAddressError('');
    return true;
  }
  const validateContactNumber = () => {
    if (contactNumber.length === 0) {
      setContactNumberError('Contact number is required');
      return false;
    } else if (contactNumber.length !== 10) {
      setContactNumberError('Enter valid contact number');
      return false;
    }
    setContactNumberError('');
    return true;
  };
  const validatePincode = () => {
    if (pincode.length === 0) {
      setPincodeError('Pincode is required');
      return false;
    } else if (pincode.length !== 6) {
      setPincodeError('Enter valid pincode');
      return false;
    }
    setPincodeError('');
    return true;
  };
  const validatePayment = ()=>{
    if(payment.length === 0){
        setPaymentError('Payment method is required');
        return false;
    }
    else{
        setPaymentError('');
        return true;
    }
  }

  function getProductPrice(price , discount , quantity){
    let discountedPrice ;
    if(discount > 0){
      discountedPrice = Math.floor((parseInt(price) - ((parseInt(price) * discount)/100)));
    }
    else{
      discountedPrice = parseInt(price);
    }
    return discountedPrice * quantity;
  }

  function getAddOrderItemList(){
    return newCartList.map((item) => ({
      "toyId": item.toyId,
      "quantity": item.quantity,
      "price": getProductPrice(item.cartItemToyDetails.price , item.cartItemToyDetails.discount , item.quantity).toString(),
    }));
  }

  const isValidDetails = () =>{
    const isValidName = validateName();
    const isValidAddress = validateAddress();
    const isValidContactNumber = validateContactNumber();
    const isValidPincode = validatePincode();
    const isValidPayment = validatePayment();

    return isValidName && isValidAddress && isValidContactNumber && isValidPincode && isValidPayment;
  }

  async function callPaymentApi(paymentDetails){
    try {
      const response = await fetch(API_BASE_URL + 'create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ amount: paymentDetails.amount, currency: 'inr' }), 
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

      const data = await response.json();
      const { clientSecret } = data;

      if (!clientSecret) {
        console.error('No clientSecret returned');
        return false;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        console.error('CardElement not found');
        return false;
      }

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email:paymentDetails.email,
            address: {
              line1: address,
              postal_code: pincode,
              country: 'IN' 
            },
          },
        },
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        return false;
      } else {
        successfulPaymentId = paymentIntent.id.toString();
        return true;
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return false;
    }
  }

   async function callPlaceOrderApi(placeOrderDetails){
     try
       {
            const response = await fetch(API_BASE_URL +'order/placeOrder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(placeOrderDetails)
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
                return formatSuccessMessage(201 , 'Order Placed  successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Failed to place order.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
  }

  function resetForm(){
     setName('');
     setAddress('');
     setContactNumber('');
     setPinCode('');
     setPayment('');
     successfulPaymentId = null;
  }

  function getCartItemIdList(){
    return newCartList.map((item) => item.cartItemId);
  }

  async function callDeleteCartItemsApi(cartItemIdList) {
    try{
        const response = await fetch(API_BASE_URL +'cartItem/deleteList' , {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cartItemIdList)
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
            return formatSuccessMessage(201 , 'Cart items deleted  successfully' , result.data);
        }
        else if(result.status === 'error'){
            const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Failed to delete cart items . Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
}

  async function deleteCartItems(){
    let cartItemIdList = getCartItemIdList();
    try{
        const result = await callDeleteCartItemsApi(cartItemIdList);
        if(result.status === 'success'){
            dispatch(setPrice(0));
            setIsLoading(false)
           setOrderResult('success')
        }
        else{
            console.log(error);
             setIsLoading(false)
             setOrderResult('failure')
        }
    }
    catch(error){
        console.log(error);
        setIsLoading(false)
        setOrderResult('failure')
    }
  }

  async function callUpdateQuantityApi(updateToyQuantityDetails){
      try
       {
            const response = await fetch(API_BASE_URL +'toy/updateQuantity' , {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateToyQuantityDetails)
            });

            if(!response.ok){
                const errorCode = response.status;
                switch(errorCode){
                    case 401:
                    return formatErrorMessage(401 , 'Unauthorized');
                }
            }
            const result = await response.json();
        
            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Toy quantity updated successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Toy quantity  updation failed.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
  }

  async function updateToyQuantity(){
     let updateToyQuantityDetails = cartItemList.map((cartItem)=>{
        return{
            toyId : cartItem.toyId,
            quantity : cartItem.quantity
        }
     });
     try{
        const result = await callUpdateQuantityApi(updateToyQuantityDetails);
        if(result.status == "success"){
            await deleteCartItems(); 
        }
        else{
            if(result.errorCode === 401 || result.errorCode === 403){
                  toast.error('Please login to place order');
                      return;
              }
             setIsLoading(false)
            setOrderResult('failure')
        }

     }
     catch(error)
     {
        console.log(error);
        toast.error('Please try again');
        setIsLoading(false)
        setOrderResult('failure')
     }
  }


  async function placeOrder(){
     let placeOrderDetails = {
        "userId" : userDetails.userId,
        "name" : name ,
        "contactNumber" : contactNumber,
        "totalAmount" : totalAmount.toString(),
        "address" : address,
        "pincode" : parseInt(pincode) ,
        "deliveryCharge" : (totalAmount - 40 < 999 ? "40" : "0"),
        "successFulPaymentId" : successfulPaymentId,
         orderItems : getAddOrderItemList()
     }
     resetForm();
     try{
        const result = await callPlaceOrderApi(placeOrderDetails);
        if(result.status == 'success'){
            await updateToyQuantity()    
        }
        else{
             if(result.errorCode === 401 || result.errorCode === 403){
                  toast.error('Please login to place order');
                  return;
              }
            setIsLoading(false)
           setOrderResult('failure')
        }
     }
     catch(error){
        console.log(error);
         setIsLoading(false)
        setOrderResult('failure')
         toast.error('Please try again');
     }
  }

  const handlePlaceOrder = async () => {
    if (!isValidDetails()) return;

    setIsLoading(true);

    if(payment === 'Online Payment'){
        const paymentDetails = {
            amount: totalAmount,
            email:userDetails.email,  
        };
        const paymentResult = await callPaymentApi(paymentDetails);
        if(!paymentResult){
             setIsLoading(false)
            setOrderResult('failure')
            return;
        }
        else{
            await placeOrder();
        }
    }
    else{
        await placeOrder();
    }
  };

  return (
    <div className='order-details-container'>
      {isLoading && <LoadingSpinner />}
      <div className='order-details-title'>Order Details</div>
      <div className='order-detail-label-input-container'>
        <div>Name</div>
        <input type='text' placeholder='Enter your name' value={name} className='order-detail-input-type' onChange={handleNameChange} />
        {nameError && <div className='error-container'>{nameError}</div>}
      </div>
      <div className='order-detail-label-input-container'>
        <div>Address</div>
        <input type='text' placeholder='Enter your address' value={address} className='order-detail-input-type' onChange={handleAddressChange} />
        {addressError && <div className='error-container'>{addressError}</div>}
      </div>
      <div className='mobile-number-pincode-container'>
        <div className='order-detail-label-input-container'>
          <div>Contact Number</div>
          <input type='number' placeholder='Enter your contact number' value={contactNumber} className='order-detail-input-type no-spinner order-detail-contact-number' onChange={handleContactNumberChange} />
          {contactNumberError && <div className='error-container'>{contactNumberError}</div>}
        </div>
        <div className='order-detail-label-input-container'>
          <div>Pincode</div>
          <input type='number' placeholder='Enter your pincode' value={pincode} className='order-detail-input-type no-spinner' onChange={handlePincodeChange} />
          {pincodeError && <div className='error-container'>{pincodeError}</div>}
        </div>
      </div>
      <div className='order-detail-label-input-container'>
        <div>Payment</div>
        <label className="custom-radio">
          <input type="radio" name="option" value="Online Payment" checked={payment === 'Online Payment'} onChange={handlePaymentChange} />
          <div>Online Payment</div>
        </label>
        <label className="custom-radio">
          <input type="radio" name="option" value="Cash on Delivery" checked={payment === 'Cash on Delivery'} onChange={handlePaymentChange} />
          <div> Cash on Delivery</div>
        </label>
        {paymentError && <div className='error-container'>{paymentError}</div>}
      </div>
       {payment === 'Online Payment' && (
        <div className='card-element-container'>
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
        </div>
      )}
      <div className='order-detail-button-container' onClick={handlePlaceOrder}>
        <div className='order-detail-button'>Place Order</div>
      </div>
     {orderResult &&  <OrderResult orderStatus ={orderResult} /> }
    </div>
  );
};

export default OrderDetailsComponent;
