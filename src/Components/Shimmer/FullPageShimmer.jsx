import React from 'react';
import ContentLoader from 'react-content-loader';
import './Shimmer.css';

const FullPageShimmer = () => {
    const headerHeight = 40;
    const lineHeight = 20;
    const lineGap = 20; // Increased gap between lines
    const columnGap = 40; // Gap between left and right columns
    const totalLines = 30;
    const totalHeight = headerHeight + (lineHeight + lineGap) * totalLines;
    const columnWidth = (window.innerWidth - columnGap) / 2;

    return (
        <div className='full-page-shimmer-container'>
            <ContentLoader
                speed={2}
                width={window.innerWidth}
                height={window.innerHeight}
                viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
                backgroundColor="#e0e0e0"
                foregroundColor="#d4d4d4"
            >
                {/* Header */}
                <rect x="0" y="0" rx="4" ry="4" width={window.innerWidth} height={headerHeight} />

                {/* Left Column */}
                {Array.from({ length: totalLines }).map((_, index) => (
                    <rect
                        key={`left-${index}`}
                        x="0"
                        y={headerHeight + index * (lineHeight + lineGap)}
                        rx="4"
                        ry="4"
                        width={columnWidth}
                        height={lineHeight}
                    />
                ))}

                {/* Right Column */}
                {Array.from({ length: totalLines }).map((_, index) => (
                    <rect
                        key={`right-${index}`}
                        x={columnWidth + columnGap}
                        y={headerHeight + index * (lineHeight + lineGap)}
                        rx="4"
                        ry="4"
                        width={columnWidth}
                        height={lineHeight}
                    />
                ))}
            </ContentLoader>
        </div>
    );
};

export default FullPageShimmer;
