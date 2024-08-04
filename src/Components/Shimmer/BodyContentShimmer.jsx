import React from 'react';
import ContentLoader from 'react-content-loader';
import './Shimmer.css';

const BodyContentShimmer = () => {
    return (
        <div className='body-content-shimmer-container'>
            <ContentLoader
                speed={2}
                width={600} 
                height={400}
                viewBox={`0 0 600 400`}
                backgroundColor="#e0e0e0"
                foregroundColor="#d4d4d4"
            >
                <rect x="0" y="0" rx="10" ry="10" width="600" height="400" /> 
            </ContentLoader>
        </div>
    );
};

export default BodyContentShimmer;
