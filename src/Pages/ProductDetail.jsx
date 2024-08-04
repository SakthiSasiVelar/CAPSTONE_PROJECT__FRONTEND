import { useParams } from "react-router-dom";
import Breadcrumbs from "../Components/BreadCrumbs/BreadCrumbs.jsx";
import './Pages.css'
import ProductImage from "../Components/ProductImage/ProductImage.jsx";
import ProductDescriptionReview from "../Components/ProductDescriptionReview/ProductDescriptionReview.jsx";
import Review from '../Components/Review/Review.jsx'
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/config.js";
import { formatErrorMessage , formatSuccessMessage } from "../utils/responseFormatter.js";
import ProductDetails from "../Components/ProductDetails/ProductDetails.jsx";
import BodyContentShimmer from '../Components/Shimmer/BodyContentShimmer.jsx'
import DescriptionShimmer from "../Components/Shimmer/DescriptionShimmer.jsx";
import { useDispatch } from "react-redux";
import { setBrandItemValues } from "../Slices/brandSlice.js";
import { setCategoryListValues } from "../Slices/categorySlice.js";


const ProductDetail = () => {
    const {productId} = useParams();
    const toyId = getToyId(productId);
    const [toyDetails , setToyDetails] = useState(null);
    const [reviewList , setReviewList] = useState(null);
    const [categoryList , setCategoryList] = useState([]);
    const [brandList , setBrandList] = useState([]);
    const [getLatestReview , setGetLatestReview] = useState(false);
    const dispatch = useDispatch();

    function getToyId(productId){
        const match = productId.match(/-(\d+)/);
        return match[1];
    }

    async function fetchToyDetails()
    {
        try{
            const response = await fetch(API_BASE_URL + `toy/get/${toyId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Toy details fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the toy id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting toy details');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    async function fetchReviewDetails()
    {
        try{
            const response = await fetch(API_BASE_URL + `review/toy/${toyId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Review details fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the toy id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting review details');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
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



    useEffect(()=>{
        let error;
        async function callFetchToyDetailsApi(){
            try{
                var result = await fetchToyDetails();
                if(result.status === 'success'){
                    setToyDetails(result.data)
                    setGetLatestReview(true);
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
        callFetchToyDetailsApi();

        if(error){
            console.log(error);
            error = false;
        }

    },[])

    useEffect(()=>{
        let error;
        async function callFetchReviewDetailsApi(){
            try{
                var result = await fetchReviewDetails();
                if(result.status === 'success'){
                    setReviewList(result.data)
                    setGetLatestReview(false)
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
        if(getLatestReview) callFetchReviewDetailsApi();
        if(error){
            console.log(error);
            error = false;
        }
    },[getLatestReview])

    function handleGetLatestReview(){
        setGetLatestReview(true);
    }

    if(categoryList.length == 0 || brandList.length == 0 || toyDetails === null || reviewList === null){
        return (
            <div className="product-detail-container">
                 <div className="product-detail-left-container">
                     <BodyContentShimmer />
                     <DescriptionShimmer />
                 </div>
                 <div className="product-detail-right-container">
                     <DescriptionShimmer />
                 </div>
            </div>
        )
    }

    return (
        <div>
            
            <div className="product-detail-container">  
                <div className="product-detail-left-container">   
                <Breadcrumbs />
                 <ProductImage imageUrl = {toyDetails.imageUrl}
                 name = {toyDetails.name} />
                 <ProductDescriptionReview description = {toyDetails.description} reviewList = {reviewList}/>
                 <Review  toyId = {toyId}  getLatestReview={handleGetLatestReview}/>
                </div>
                <div className="product-detail-right-container">
                   <ProductDetails toyDetails = {toyDetails} categoryList = {categoryList} brandList = {brandList} reviewList = {reviewList}  />
                 </div>
            </div>
            
        </div>

       
    )
}

export default ProductDetail;