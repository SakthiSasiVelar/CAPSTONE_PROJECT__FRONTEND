import './ProductDescriptionReview.css'
import { FaPlus , FaMinus} from 'react-icons/fa';
import {Rate} from 'antd'
import { useState } from 'react';

const ProductDescriptionReview = (props) =>{
    const [isDescriptionVisible , setIsDescriptionVisible] = useState(false);
    const [isReviewVisible , setIsReviewVisible] = useState(false)
    const reviewDetailsList = props.reviewList;

    const handleDescriptionVisibleToggle = (event)=>{
        event.preventDefault();
        event.stopPropagation();
        setIsDescriptionVisible(!isDescriptionVisible);
    }

    const handleReviewVisibleToggle = (event) =>{
        event.preventDefault();
        event.stopPropagation();
        setIsReviewVisible(!isReviewVisible);
    }
    return (
        <div className="product-description-review-container">
            <hr className='product-description-review-horizontal-line'/>
            <div className='product-description-review-title-container'>
                <div className='product-description-review-title'>Description</div>
                { !isDescriptionVisible ? <FaPlus  onClick={ (event) =>handleDescriptionVisibleToggle(event)} style={{cursor:'pointer'}}/> : <FaMinus style={{cursor:'pointer'}}  onClick={handleDescriptionVisibleToggle}/> }
            </div>
           {isDescriptionVisible  &&  
               <div className='product-description-review-title-value-container'>
                    <p className='product-description-review-description'>{props.description}</p>
                </div>
           }
            <hr className='product-description-review-horizontal-line'/>
            <div className='product-description-review-title-container'>
                <div className='product-description-review-title'>Ratings & Reviews</div>
             {!isReviewVisible  ? <FaPlus style={{cursor:'pointer'}} onClick={(e) => handleReviewVisibleToggle(e)} /> : <FaMinus style={{cursor:'pointer'}} onClick={handleReviewVisibleToggle} /> }
            </div>

            {isReviewVisible && 
                <div className='rating-review-value-outer-container'>
                    { reviewDetailsList.length > 0 ? reviewDetailsList.map((review) =>{
                        return (
                            <div key={review.reviewId} className='rating-review-value-container'>
                            <Rate disabled defaultValue={review.ratings} />
                            <div>{review.reviewText}</div> 
                            </div>
                        )
                    }) : <div style={{textAlign:'center'}}>No Reviews Available.</div>}
                </div>
            }

        </div>
    )
}

export default ProductDescriptionReview;