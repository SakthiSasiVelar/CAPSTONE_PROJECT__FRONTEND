import { useDispatch, useSelector } from "react-redux";
import { rehydrate , logout } from "../Slices/userSlice";
import { useEffect} from "react";
import {jwtDecode }from 'jwt-decode'

const useAuth = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((store)=>store.user.userDetails)
  const isLoggedIn = useSelector((store)=>store.user.isLoggedIn)
  let newUserDetails ;

  function mapNewUserDetails(decodedToken){
     const userDetails = {
      userId: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      name: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    };
    return userDetails ;
  }

  useEffect(()=>{
    const token = sessionStorage.getItem('token');
    if(token){
      try{
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now()/1000;

        if(decodedToken.exp < currentTime){
          dispatch(logout());
        }
        else{
          newUserDetails = mapNewUserDetails(decodedToken);
          dispatch(rehydrate(newUserDetails));
        }
        
      }
      catch(error){
        dispatch(logout());
      }
    }
  },[])


  return{
    isLoggedIn ,
    userDetails
  }
};

export default useAuth;
