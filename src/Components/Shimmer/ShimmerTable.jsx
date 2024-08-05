import React from 'react';
import ContentLoader from 'react-content-loader';

const ShimmerTable = () => {
    const rows = Array(7).fill(null).map((_, index) => (
        <ContentLoader
            key={index}
            speed={2}
            width="100%"
            height={50}
            backgroundColor="#e0e0e0"
            foregroundColor="#d4d4d4"
        >
            <rect x="0" y="15" rx="3" ry="3" width="15%" height="20" />
            <rect x="17%" y="15" rx="3" ry="3" width="15%" height="20" />
            <rect x="34%" y="15" rx="3" ry="3" width="15%" height="20" />
            <rect x="51%" y="15" rx="3" ry="3" width="10%" height="20" />
            <rect x="63%" y="15" rx="3" ry="3" width="10%" height="20" />
            <rect x="75%" y="15" rx="3" ry="3" width="10%" height="20" />
            <rect x="87%" y="15" rx="3" ry="3" width="10%" height="20" />
        </ContentLoader>
    ));

    return <>{rows}</>;
};

export default ShimmerTable;
