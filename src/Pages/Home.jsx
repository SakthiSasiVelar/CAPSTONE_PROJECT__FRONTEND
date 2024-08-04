
import Banner from '../Components/Banner/Banner.jsx'
import Category from '../Components/Category/Category.jsx';
import Brand from '../Components/Brand/Brand.jsx';
import NewArrival from '../Components/NewArrival/NewArrival.jsx';
import { useDispatch } from 'react-redux';
import { setBrandItemValues } from '../Slices/brandSlice.js';
import {setCategoryListValues} from '../Slices/categorySlice.js'
import { API_BASE_URL } from '../utils/config.js';
import { useEffect , useState } from 'react';
import { formatSuccessMessage , formatErrorMessage } from '../utils/responseFormatter.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderBannerShimmer from '../Components/Shimmer/HeaderBanner.jsx';
import ShimmerImage from '../Components/Shimmer/ShimmerImage.jsx';

const Home = () => {
    const [categoryList , setCategoryList] = useState([]);
    const [brandList , setBrandList] = useState([]);
    const [newArrivalList , setNewArrivalList] = useState([]);
    const dispatch = useDispatch();

    async function fetchCategories()
    {
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

    async function fetchNewArrivals()
    {
        try{
            const response = await fetch(API_BASE_URL + `toy/filter/newArrival`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'New Arrival toys list fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message);
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting new arrival toys  list');
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

        async function callFetchNewArrivalApi(){
            try{
                var result = await fetchNewArrivals();
                if(result.status === 'success'){
                    setNewArrivalList(result.data);
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
        callFetchNewArrivalApi();

        if(error){
            toast.error('Please try again!');
            error = false;
        }

    }, [])

    if(categoryList.length == 0 || brandList.length == 0 || newArrivalList.length == 0) return(
        <>
        <HeaderBannerShimmer />
         <ShimmerImage />
         <ShimmerImage />

        </>
    )

    return (
        <div className='home-body-container'>
        <Banner />
        <Category categoryList = {categoryList}/>
        <Brand brandList = {brandList}/>
        <NewArrival newArrivalList = {newArrivalList} />
        </div>
    )
}

export default Home;