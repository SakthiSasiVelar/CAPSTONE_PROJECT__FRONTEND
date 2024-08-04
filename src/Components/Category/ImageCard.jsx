import './ImageCard.css'
import {Link} from 'react-router-dom'

const ImageCard = ({imageUrl , categoryName}) => {
    return (
        <Link to={`/category/${categoryName}`}>
           <div className='image-card'>
             <img src={imageUrl} alt="Product" /> 
           </div>
        </Link>   
    )
}

export default ImageCard;