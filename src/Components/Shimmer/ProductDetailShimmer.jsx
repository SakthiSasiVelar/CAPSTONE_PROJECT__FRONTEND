import React from 'react'
import BodyContentShimmer from './BodyContentShimmer'
import DescriptionShimmer from './DescriptionShimmer'
import '../../Pages/Pages.css'

const ProductDetailShimmer = () => {
  return (
    <div className="product-detail-container">
                 <div className="product-detail-left-container">
                     <BodyContentShimmer />
                     <DescriptionShimmer />
                 </div>
                 <div className="product-detail-right-container">
                     <DescriptionShimmer />
                 </div>
            </div>
  )
}

export default ProductDetailShimmer