import React from 'react';
import ContentLoader from 'react-content-loader';
import './Shimmer.css'; // Ensure you have appropriate styles for shimmer

const HeaderBannerShimmer = () => {
    return (
        <div className='header-banner-shimmer-container'>
            <ContentLoader
                speed={2}
                width={window.innerWidth} 
                height={300} 
                viewBox={`0 0 ${window.innerWidth} 300`}
                backgroundColor="#e0e0e0"
                foregroundColor="#d4d4d4"
            >
                <rect x="0" y="0" rx="0" ry="0" width={window.innerWidth} height="300" />
                
            </ContentLoader>
        </div>
    );
};

export default HeaderBannerShimmer;
