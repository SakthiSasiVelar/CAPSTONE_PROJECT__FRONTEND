import React from 'react';
import ContentLoader from 'react-content-loader';
import './Shimmer.css'

const ShimmerImage = () => {
    const shimmerLoaders = new Array(5).fill(null);

    return (
        <div className='shimmer-container'>
            {shimmerLoaders.map((_, index) => (
                <ContentLoader className='content-loader'
                    key={index}
                    speed={2}
                    width={240}
                    height={260}
                    viewBox='0 0 240 260'
                    backgroundColor="#e0e0e0" 
                    foregroundColor="#d4d4d4" 
                >
                    <rect x='0' y='0' rx='0' ry='0' width='240' height='210' />
                    
                </ContentLoader>
            ))}
        </div>
    );
};

export default ShimmerImage;
