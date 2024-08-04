import React from 'react';
import ContentLoader from 'react-content-loader';
import './Shimmer.css';

const DescriptionShimmer = () => {
    const lineHeight = 20;
    const lineGap = 10;
    const totalLines = 10;
    const totalHeight = (lineHeight + lineGap) * totalLines - lineGap; 

    return (
        <div className='body-content-shimmer-container'>
            <ContentLoader
                speed={2}
                width={600} 
                height={totalHeight}
                viewBox={`0 0 500 200`}
                backgroundColor="#e0e0e0"
                foregroundColor="#d4d4d4"
            >
                {Array.from({ length: totalLines }).map((_, index) => (
                    <rect 
                        key={index} 
                        x="0" 
                        y={index * (lineHeight + lineGap)} 
                        rx="4" 
                        ry="4" 
                        width="600"
                        height={lineHeight} 
                    />
                ))}
            </ContentLoader>
        </div>
    );
};

export default DescriptionShimmer;
