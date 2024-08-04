import './Banner.css'
import Banner1 from '../../assets/Banner/Banner1.avif'
import Banner2 from '../../assets/Banner/Banner 2.avif'
import Banner3 from '../../assets/Banner/Banner 3.avif'
import { Carousel } from 'antd';

const Banner =()=>{
    return (
        <div className='banner-container'>
           <Carousel autoplay arrows infinite={true} >
            <div>
               <img src={Banner1} alt="banner1" className='banner' />
            </div>
            <div>
            <   img src={Banner2} alt="banner2" className='banner'/>
            </div>
            <div>
               <img src={Banner3} alt="banner3" className='banner' />
            </div>
      </Carousel>
        </div>
      
    )
}

export default Banner;