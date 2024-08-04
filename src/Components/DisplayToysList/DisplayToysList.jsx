import DisplayToysListHeader from './DisplayToyListHeader';
import './DisplayToysList.css'
import ImageCard from './ImageCard';
import { useSelector  } from 'react-redux';
import { API_BASE_URL } from '../../utils/config';
import { useEffect , useState} from 'react';
import { formatSuccessMessage , formatErrorMessage } from '../../utils/responseFormatter';
import ToyListShimmer from '../Shimmer/ToyListShimmer';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const DisplayToysList = (props) => {
    const selectedFilterValues = useSelector((store)=>store.filter.selectedFilterValues);
    const categoriesList = props.categoryList;
    const brandList = props.brandList;
    const [toyList, setToyList] = useState(null);
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);


    async function fetchToyList(filterValueDetails)
    {
        try{
            const response = await fetch(API_BASE_URL + `toy/filter`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filterValueDetails),
            });
            const result = await response.json();

            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Toy details list fetched successfully' ,result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                console.log(result.message)
                switch(errorCode){
                    case 400:
                    return formatErrorMessage(400 ,'Please check the user id');
                    case 500:
                        return formatErrorMessage(500 ,'Error in getting toy details list');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    function getCategoryIdByName(categoryName){
        if(categoryName == null){
            return null;
        }
        else{
            return categoriesList.filter((category) => category.categoryName == categoryName)[0].categoryId;
        }
    }

    function getBrandIdByName(brandName){
        if(brandName == null){
            return null;
        }
        else{
            return brandList.filter((brand) => brand.brandName == brandName)[0].brandId;
        }
    }

    function getMinPrice(price){
        if(price == null){
            return null;
        }
        else{
            let number = price.split("-");
            return number[0];
        }
    }

    function getMaxPrice(price){
        if(price == null){
            return null;
        }
        else{
            let number = price.split("-");
            return number[1];
        }
    }

   function capitalizeFirstLetter(string) {
    if (!string) return string; 
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
    useEffect(()=>{
        async function apiCall(){
            let filterValueDetails ={
                categoryId:getCategoryIdByName(selectedFilterValues.Category),
                brandId:getBrandIdByName(selectedFilterValues.Brand),
                ageRange : selectedFilterValues.Age,
                minPrice:getMinPrice(selectedFilterValues.Price),
                maxPrice:getMaxPrice(selectedFilterValues.Price)
            }
            try{
                var result = await fetchToyList(filterValueDetails);
                if(result.status === 'success'){
                    setToyList(result.data)
                }
                else{
                    toast.error('Please try again!')
                }
            }
            catch(error){
                toast.error('Please try again!')
                console.log(error);
            }
        }
        // if((selectedFilterValues[capitalizeFirstLetter(pathSnippets[0])]) === pathSnippets[1]) 
        apiCall();
    }, [selectedFilterValues])

    if(toyList === null) return <ToyListShimmer />

    return (
        <div className='display-toy-list-container'>
            <DisplayToysListHeader />
           
            <div className='total-product-label-container'> 
                 { toyList && toyList.length == 0 ? <div>No products Available!</div> : 
                     <div>{toyList ? toyList.length : 0} {toyList && toyList.length > 1 ? 'products' : 'product'}</div>
                 }
            </div>
            {toyList == null ? <ToyListShimmer /> : 
                <div className='toy-list-items-outer-conatiner'>
                    {
                        toyList.map(toy => {
                            return <ImageCard key={toy.toyId} {...toy} />  
                        })
                    }
                </div>
            }
        </div>
    )
}

export default DisplayToysList;