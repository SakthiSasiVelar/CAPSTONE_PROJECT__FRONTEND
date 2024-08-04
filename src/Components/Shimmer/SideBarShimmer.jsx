import React from 'react';
import ContentLoader from 'react-content-loader';
import './Shimmer.css'; 

const SidebarShimmer = () => {
    return (
        <div className='sidebar-shimmer-container'>
            <ContentLoader
                speed={2}
                width={300} 
                height={600}
                viewBox="0 0 300 600"
                backgroundColor="#e0e0e0"
                foregroundColor="#d4d4d4"
            >
                <rect x="0" y="0" rx="10" ry="10" width="300" height="60" /> 
                <rect x="0" y="120" rx="10" ry="10" width="300" height="60" /> 
                <rect x="0" y="200" rx="10" ry="10" width="300" height="60" /> 
                <rect x="0" y="280" rx="10" ry="10" width="300" height="60" /> 
                <rect x="0" y="360" rx="10" ry="10" width="300" height="60" /> 
                <rect x="0" y="440" rx="10" ry="10" width="300" height="60" /> 
            </ContentLoader>
        </div>
    );
};

export default SidebarShimmer;
