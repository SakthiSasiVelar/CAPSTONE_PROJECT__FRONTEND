import './Pages.css'
import BreadCrumbs from "../Components/BreadCrumbs/BreadCrumbs.jsx";
import { useDispatch } from "react-redux";
import { setCategoryListValues } from "../Slices/categorySlice.js";
import { setBrandItemValues } from "../Slices/brandSlice.js";
import FilterContainer from "../Components/Filter/FilterContainer.jsx";
import DisplayToysList from "../Components/DisplayToysList/DisplayToysList.jsx";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../utils/config.js';
import { formatSuccessMessage , formatErrorMessage } from '../utils/responseFormatter.js';
import ToyListShimmer from '../Components/Shimmer/ToyListShimmer.jsx';
import SidebarShimmer from '../Components/Shimmer/SideBarShimmer.jsx';


const BrandPage = () =>{
    const [categoryList , setCategoryList] = useState([]);
    const [brandList , setBrandList] = useState([]);
    const dispatch = useDispatch();

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
        async function callFetchCategoryApi(){
            try{
                var result = await fetchCategories();
                if(result.status === 'success'){
                    setCategoryList(result.data)
                    dispatch(setCategoryListValues(result.data))
                }
                else{
                    console.log(result);
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
                    console.log(result)
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

        if(error){
            toast.error('Please try again!');
            error = false;
        }
    }, [])

    if(categoryList.length == 0 || brandList.length == 0) return (
         <div className="display-filter-list-body-container">
            <SidebarShimmer />
            <ToyListShimmer />
        </div>
    )

    return (
        <div>
            <BreadCrumbs />
            <div className="display-filter-list-body-container">
                <FilterContainer categoryList = {categoryList} brandList = {brandList}/>
                <DisplayToysList categoryList = {categoryList} brandList = {brandList} />
             </div>
        </div>

    )
}

export default BrandPage;