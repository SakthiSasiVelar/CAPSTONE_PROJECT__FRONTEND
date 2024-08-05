import React from 'react';
import ContentLoader from 'react-content-loader';
import './Shimmer.css';

const CartImageShimmer = () => {
    return (
        <div className='cart-image-shimmer-container'>
            <ContentLoader
                speed={2}
                width={900} 
                height={400 * 5}
                viewBox="0 0 600 2000"
                backgroundColor="#e0e0e0"
                foregroundColor="#d4d4d4"
            >
                <rect x="0" y="0" rx="10" ry="10" width="600" height="200" />
                <rect x="0" y="220" rx="10" ry="10" width="600" height="200" />
                <rect x="0" y="440" rx="10" ry="10" width="600" height="200" />
                <rect x="0" y="660" rx="10" ry="10" width="600" height="200" />
                <rect x="0" y="880" rx="10" ry="10" width="600" height="200" />
            </ContentLoader>
        </div>
    );
};

export default CartImageShimmer;
