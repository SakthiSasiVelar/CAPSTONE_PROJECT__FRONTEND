import { useState } from 'react'
import './Review.css'
import {Rate} from 'antd'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../utils/config';
import { formatErrorMessage , formatSuccessMessage } from '../../utils/responseFormatter';
import { useSelector } from 'react-redux';

const Review = (props) =>{
    const [rating , setRating] = useState(0);
    const [review , setReview] = useState('');
    const [reviewError , setReviewError] = useState('');
    const [ratingError , setRatingError] = useState('');
    const {isLoggedIn , userDetails} = useSelector((store)=>store.user)
    const token = sessionStorage.getItem('token');


    const handleChange = (value)=>{
       setRating(value)
    }

    const handleReviewChange = (e)=>{
        setReview(e.target.value);
    }

    function resetForm (){
        setReview('');
        setRating(0);
    }

    function validateReview(review){
        if(review.length == 0){
            setReviewError('Review field cannot be empty');
            return false;
        }
        else{
            setReviewError('');
            return true;
        }
    }

    function validateRating(rating){
        if(rating == 0){
            setRatingError('Rating field cannot be empty');
            return false;
        }
        else{
            setRatingError('');
            return true;
        }
    }

       const addReview = async(reviewDetails) => {
       try
       {
            const response = await fetch(API_BASE_URL +'review/add' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify(reviewDetails)
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
                return formatSuccessMessage(201 , 'Review added successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');                  
                    case 500:
                        return formatErrorMessage(500 , 'Failed to add review.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    const isValidReviewDetails = () =>{
        const isValidReview =  validateReview(review);
        const isValidRating = validateRating(rating);


        return isValidReview && isValidRating;
    }

    const handleClick = async() =>{
        if(!isLoggedIn) {
            toast.error('Please login to add Review!')
            return;
        }
        if(isValidReviewDetails()){
            let ratingReviewDetails = {
                reviewText : review,
                ratings : rating.toString(),
                userId : userDetails.userId,
                toyId : props.toyId
            }
            try{
                const result = await addReview(ratingReviewDetails);
                if(result.status ==='success'){
                    toast.success('Review added successfully');   
                    props.getLatestReview();              
                }
                else{
                    if(result.errorCode === 401 || result.errorCode === 403){
                        toast.error('Please login');
                        resetForm();
                        return;
                    }
                    toast.error('Failed to add review');
                }
                resetForm();
            }
            catch(error){
                toast.error('Failed to add review. Please try again');
                console.log(error);
            }
        }
    }
    return(
        <div className='review-container'>
            <div className='review-title'>Write a review</div>
            <div className='review-body'>
                <div>
                    <div className='review-label'>Your Review :</div>
                     <textarea className='review-textarea' value={review} onChange={(e)=>handleReviewChange(e)}></textarea>
                     {reviewError.length > 0 && <div className='error-container'>{reviewError}</div>}
                </div>
                 <Rate onChange={(e) =>handleChange(e)} value={rating}/>
                {ratingError.length > 0 && <div className='error-container'>{ratingError}</div>}
            </div>
            <div className='review-button-container'>
                <button className='review-button' onClick={handleClick}>Submit</button>
            </div>
        </div>
    )
}

export default Review;