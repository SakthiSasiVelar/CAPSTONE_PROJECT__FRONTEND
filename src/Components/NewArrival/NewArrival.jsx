import ImageCard from './ImageCard.jsx';
import './NewArrival.css'
import CustomArrow from '../CustomArrow/CustomArrow';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Shimmer from '../Shimmer/ShimmerImage.jsx';

var sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow:<CustomArrow />,
        prevArrow:<CustomArrow />,
         responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
};



const NewArrival = (props) =>{
    
    const newArrivalList = props.newArrivalList;
    return(
        <div className='new-arrival-container'>
            <h1 className='new-arrival-title'>New Arrival</h1>
            { 
               newArrivalList.length <= 0 ? <div><Shimmer /></div> :
                <Slider {...sliderSettings}>
                    {newArrivalList.map((toy) =>{
                        return <ImageCard key={toy.toyId} {...toy}/>
                    })}
                </Slider>
            }
        </div>
    )
}

export default NewArrival;