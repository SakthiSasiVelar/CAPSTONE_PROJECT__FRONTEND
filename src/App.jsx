import NavBar from './Components/NavBar/NavBar';
import FootBar from './Components/FootBar/FootBar';
import Footer from './Components/Footer/Footer'
import { Outlet } from 'react-router-dom';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from './Hooks/useAuth.js';
import { API_BASE_URL } from './utils/config.js';
import { formatErrorMessage , formatSuccessMessage } from './utils/responseFormatter.js';
import { useEffect , useState } from 'react';
import { useDispatch } from 'react-redux';
import { setItemtoCart } from './Slices/cartSlice.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearCart } from './Slices/cartSlice.js';
import CartItemDetails from './Components/CartItemDetails/CartItemDetails.jsx';

const App = () => {
  const {isLoggedIn , userDetails} = useAuth();
  const dispatch = useDispatch();
  const [cartItems , setCartItems] = useState(null);
  const token = sessionStorage.getItem('token');

   async function callFetchCartDetailsApi(){
      try{
          const response = await fetch(API_BASE_URL + `cartItem/get/user/${userDetails.userId}`,{
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });

          if(!response.ok){
            const errorCode = response.status;
            switch(errorCode){
                case 401:
                    return formatErrorMessage(401 , 'Unauthorized')
                case 403:
                    return formatSuccessMessage(403 , 'Forbidden') 
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
           toast.error('Please Login !!');
           return;
         }
         toast.error('Please refresh the page')
       }
    }
    catch(error){
      console.log(error);
      toast.error('Please refresh the page')
    }
       
  }

  useEffect(()=>{
    if(isLoggedIn && userDetails.role === 'User'){
       fetchCartItems();
    }
    else{
       dispatch(clearCart())
    }
  },[isLoggedIn])


  if(isLoggedIn && cartItems === null) return null


  return (
    <div>
      <ScrollToTop />
      <NavBar isLoggedIn = {isLoggedIn} userDetails = {userDetails}/>
      <Outlet />
      <Footer />
      <FootBar />
    </div>
  )
}


export default App;