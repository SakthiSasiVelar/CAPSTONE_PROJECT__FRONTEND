import './DisplayToysList.css'
import { IoBagHandleSharp } from "react-icons/io5";
import { Link , useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/config';
import { formatErrorMessage , formatSuccessMessage } from '../../utils/responseFormatter';
import { useSelector } from 'react-redux';

const ImageCard = ({imageUrl , name , price , discount , toyId  })=>{
    let discountPercent = parseInt(discount);
    var discountedPrice ;
    if(discountPercent > 0){
       discountedPrice = Math.floor((parseInt(price) - ((parseInt(price) * discountPercent)/100)));
    }
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const path = `/${pathSnippets[0]}/${pathSnippets[1]}/${name}-${toyId}`

    return (
        <Link to={path} className='link-tag'>
            <div className='toy-list-item-container'>
                <div className='image-bag-container'>
                    <img src={imageUrl} className='toy-image'/>
                </div>
                <div>
                    <p className='toy-name'>{name}</p>
                    <div className='toy-price-container'>
                        {
                            discountPercent > 0  ? 
                            <>
                                <div><s style={{color:'grey'}}>₹ {parseInt(price)}</s></div>
                                <div><span style={{color:'red'}}>₹ {discountedPrice}</span></div>
                                <div><span style={{color : 'green'}}>Save {discountPercent}%</span></div>
                            </> :
                            <>
                            <div><span style={{color:'red'}}>₹ {parseInt(price)}</span></div>
                            </>
                        }
                    
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ImageCard;