import { useEffect, useState } from 'react';
import Breadcrumbs from '../Components/BreadCrumbs/BreadCrumbs';
import TrackOrderItemDetails from '../Components/TrackOrderItemDetails/TrackOrderItemDetails';
import './Pages.css'
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../utils/config';
import { formatErrorMessage , formatSuccessMessage } from '../utils/responseFormatter';
import TrackOrderItemDetailsShimmer from '../Components/Shimmer/TrackOrderItemDetailsShimmer ';

const TrackOrderItem = () =>{
    const {orderItemId} = useParams();
    const [orderItem , setOrderItem] = useState(null);
    const [orderDetails , setOrderDetails] = useState(null);
    const [toyDetail , setToyDetail] = useState(null);
    const token = sessionStorage.getItem('token');


    async function callGetOrderItemApi(){
        try{
            const response = await fetch(API_BASE_URL + `orderItem/get/${orderItemId}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
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
                return formatSuccessMessage(200 , 'Order item details  fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting order item details ');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function callGetOrderApi(orderId){
        try{
            const response = await fetch(API_BASE_URL + `order/get/${orderId}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
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
                return formatSuccessMessage(200 , 'Order  details  fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting order  details ');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function callGetToyApi(toyId){
        try{
            const response = await fetch(API_BASE_URL + `toy/get/${toyId}`);
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , ' Toy  details  fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting toy  details ');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }



    useEffect(()=>{
        async function getOrderDetails(){
            try{
                const result = await callGetOrderApi(orderItem.orderId)
                if(result.status == 'success'){
                    setOrderDetails(result.data);
                }
                else{
                     if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to see order details' );
                        return;
                    }
                    toast.error('Failed to see order details')
                }
            }
            catch(error){
                console.log(error);
                toast.error('Please Try Again')
            }
        }

        async function getToyDetails(){
            try{
               const result = await callGetToyApi(orderItem.toyId)
                if(result.status == 'success'){
                    setToyDetail(result.data);
                }
                else{
                    console.log(result);
                    toast.error('Please Try Again')
                }
            }
            catch(error){
                console.log(error);
                toast.error('Please Try Again')
            }
        }
        
        if(orderItem !== null){
             getOrderDetails();
             getToyDetails();
        }

    },[orderItem])

    useEffect(()=>{
        async function getOrderItemDetails(){
            try{
                const result = await callGetOrderItemApi()
                if(result.status == 'success'){
                    
                    setOrderItem(result.data);
                }
                else{
                     if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login to see order items' );
                        return;
                    }
                    toast.error('Failed to see order items')
                }
            }
            catch(error){
                console.log(error);
                toast.error('Please Try Again')
            }
        }

        if(orderItemId !== null ){
            getOrderItemDetails();
        }

    },[])
 
     if(orderItem === null || orderDetails === null || toyDetail === null)return (
        <div className="track-order-item-container">
             <TrackOrderItemDetailsShimmer />
        </div>
     )


    return (
        <div className="track-order-item-container">
            <Breadcrumbs />
            <TrackOrderItemDetails orderItemDetails = {orderItem}  orderDetails = {orderDetails} toyDetails = {toyDetail} />
        </div>
    )
}

export default TrackOrderItem;