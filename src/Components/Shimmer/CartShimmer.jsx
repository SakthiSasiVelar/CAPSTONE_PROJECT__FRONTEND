import React from 'react'
import CartImageShimmer from './CartImageShimmer'
import DescriptionShimmer from './DescriptionShimmer'
import '../../Pages/Pages.css'


const CartShimmer = () => {
  return (
     <div className="cart-container">
            <div className="card-left-container">
                <CartImageShimmer />
            </div>
            <div>
                <DescriptionShimmer />
                <DescriptionShimmer />
            </div>
        </div>
  )
}

export default CartShimmer