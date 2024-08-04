import './ImageCard.css'
import {Link} from 'react-router-dom'

const ImageCard = ({imageUrl , brandName}) => {
    return (
        <Link to={`/brand/${brandName}`}>
           <div className='image-card'>
             <img src={imageUrl} alt="Product" /> 
           </div>
        </Link>   
    )
}

export default ImageCard;