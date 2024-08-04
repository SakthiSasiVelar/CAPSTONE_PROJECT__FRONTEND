import './ImageCard.css'
import {Link} from 'react-router-dom'
import NewImage from '../../assets/Images/newImage.png'

const ImageCard = ({name , imageUrl , discount ,price  , toyId }) =>{
    const discountPercent = parseInt(discount);
    
    var discountedPrice ;
    if(discountPercent > 0){
       discountedPrice = Math.floor((parseInt(price) - ((parseInt(price) * discountPercent)/100)));
    }
    
    return (
      <Link to={`/${name}-${toyId}`} className= 'new-arrival-link-tag'>
         <div className='new-arrival-image-card-container'>
            <div className='new-arrival-card-header'>
               <img src={NewImage} alt='new' />
            </div>
            <div className='new-arrival-img-conatiner'>
               <img src={imageUrl} />
            </div>
            <h3>{name}</h3>
            <div className='new-arrival-footer'>
               <div className='price'>
                  {discountPercent > 0  ?  (
                     <div className='price-discount-container'>
                           <div><s className='strike-out-price'>₹ {price}</s> ₹ {discountedPrice}</div>
                           <div className='discount'>Save {discount}%</div>
                     </div>
                  ) : <div>₹ {price}</div>} 
                  
               </div>
               
            </div>
         </div>
      </Link>

    )
}

export default ImageCard;