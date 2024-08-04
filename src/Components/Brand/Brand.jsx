import './Brand.css'
import ImageCard from '../Brand/ImageCard.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CustomArrow from '../CustomArrow/CustomArrow.jsx';
import ShimmerImage from '../Shimmer/ShimmerImage.jsx';


const Category = (props) => {
    const brandList =props.brandList;
    var sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow:<CustomArrow />,
        prevArrow:<CustomArrow />,
         responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
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

    return (
      <div className='brand-container'>
        <h1 className='brand-title'>Shop By Brand</h1>
        {brandList.length <= 0 ? <div><ShimmerImage /></div> : 
            <Slider {...sliderSettings} className='image-card-container'>
            {brandList.map((brand) => {
                return <ImageCard key={brand.brandId}  {...brand} />
            })}
            </Slider>
        }

      </div>
    )
}

export default Category;