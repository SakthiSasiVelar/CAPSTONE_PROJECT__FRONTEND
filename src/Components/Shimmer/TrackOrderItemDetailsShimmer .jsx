import React from 'react';
import ContentLoader from 'react-content-loader';

const TrackOrderItemDetailsShimmer = () => {
    return (
        <div className="body-content-track-item-shimmer-container">
        {[...Array(2)].map((_, index) => (
                <div key={index} className="track-order-item-details-card-shimmer">
                     <ContentLoader
                        speed={2}
                        width="100%"
                        height={200} // Adjust height to match the height of your card
                        backgroundColor="#e0e0e0"
                        foregroundColor="#d4d4d4"
                     >
                        <rect x="0" y="0" rx="10" ry="10" width="100%" height="200" /> 
                    </ContentLoader>
                </div>
            ))}
            </div>
       
    );
};


export default TrackOrderItemDetailsShimmer;
