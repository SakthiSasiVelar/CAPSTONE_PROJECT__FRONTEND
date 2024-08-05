import { useEffect, useState } from "react";
import ListOrder from "../Components/ListOrder/ListOrder";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/config";
import { formatErrorMessage , formatSuccessMessage } from "../utils/responseFormatter";
import Breadcrumbs from "../Components/BreadCrumbs/BreadCrumbs";
import 'react-toastify/dist/ReactToastify.css';
import NotLoggedInImage from '../assets/Images/NotLoggedInImage.jpg'
import TrackOrderItemDetailsShimmer from "../Components/Shimmer/TrackOrderItemDetailsShimmer ";
import NoOrderImage from '../assets/Images/NoOrderImage.png'

const TrackOrder = ()=>{
    const [orderItemList , setOrderItemList] = useState(null);
    const [toyDetailsList , setToyDetailsList] = useState(null);
    const {isLoggedIn ,userDetails} = useSelector((store) => store.user);
    const token = sessionStorage.getItem('token');

    async function callFetchOrderItemApi(userId){
          try{
            const response = await fetch(API_BASE_URL + `orderItem/getAll/${userId}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            );

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
                return formatSuccessMessage(200 , 'Order items list fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting order item details list');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }  

    async function callFetchToyDetailsApi(toyIdList){
        try
       {
            const response = await fetch(API_BASE_URL +'toy/getList' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toyIdList)
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

    function getToyIdList (){
        if(orderItemList.length > 0){
            return [...new Set(orderItemList.map((item) => item.toyId))];
        }
        else{
            return [];
        }
    }

    useEffect(()=>{
        async function getOrderItemToyDetails(){
            let toyIdList = {
                toyIdList : getToyIdList()
            }
            try{
                const result = await callFetchToyDetailsApi(toyIdList);
                if(result.status === 'success'){
                    setToyDetailsList(result.data);
                }
                else{
                    
                    toast.error('Failed to get order items')
                }
            }
            catch(error){
                 console.log(error);
                  toast.error('please refresh the page')
            }
        }

        if(orderItemList && orderItemList.length > 0){
            getOrderItemToyDetails();
        }
        else if(orderItemList !== null && orderItemList.length == 0){
            setToyDetailsList([]);
        }
      
    },[orderItemList])

    

    useEffect(() =>{
        async function getOrderItemDetails(){
            try{
                const result = await callFetchOrderItemApi(userDetails.userId);
                if(result.status ==='success'){
                    setOrderItemList(result.data);
                }
                else{
                     if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to see order items' );
                        return;
                    }
                    toast.error('please refresh the page')
                }
            }
            catch(error){
                console.log(error);
                toast.error('please refresh the page')
            }
        }

        if(userDetails.userId){
            getOrderItemDetails();
        }
    },[userDetails])

      if(!isLoggedIn) {
        return (
            <div className="not-logged-in-label">
                <div>LOGIN TO TRACK ORDER</div>
                <img src={NotLoggedInImage} />
            </div>
        )
    }
    
    if(orderItemList === null || toyDetailsList === null)return (
         <div className="track-order-container">
            <TrackOrderItemDetailsShimmer />
         </div>
    )

    return(
        <div className="track-order-container">
            {orderItemList.length === 0 ? 
            <div className="empty-order-label">
                <div>No Orders Found</div>
                <img src={NoOrderImage} />
            </div>
            :
            <>
                <Breadcrumbs />
                <ListOrder orderItemList = {orderItemList} toyDetailsList = {toyDetailsList}/>
            </>
            }
        </div>
    )
};

export default TrackOrder;