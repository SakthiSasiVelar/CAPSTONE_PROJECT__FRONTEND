import './Category.css';
import ImageCard from './ImageCard.jsx';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import CustomArrow from '../CustomArrow/CustomArrow.jsx';
import ShimmerImage from '../Shimmer/ShimmerImage.jsx';

const Category = (props) => {
    const categoriesList = props.categoryList;
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

    return (
      <div className='category-container'>
        <h1 className='category-title'>Shop By Category</h1>
        {categoriesList.length <= 0 ? <div><ShimmerImage /></div> : 
            <Slider {...sliderSettings} className='image-card-container'>
            {categoriesList.map((category) => {
                return <ImageCard key={category.categoryId}  {...category} />
            })}
            </Slider>
        }

      </div>
    )
}

export default Category;