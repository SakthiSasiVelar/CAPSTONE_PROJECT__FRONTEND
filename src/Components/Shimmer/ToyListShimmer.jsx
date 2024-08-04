
import ContentLoader from 'react-content-loader';
import './Shimmer.css'

const ToyListShimmer = () => {
    const shimmerLoaders = new Array(10).fill(null);

    return (
        <div className='shimmer-container'>
          {shimmerLoaders.map((_, index) => (
                <ContentLoader 
                        key={index}
                        speed={2}
                        width={340}
                        height={440}
                        viewBox="0 0 340 440"
                        backgroundColor="#e0e0e0" 
                        foregroundColor="#d4d4d4" 
                    >
                        
                        <rect x="0" y="0" rx="10" ry="10" width="340" height="340" /> 
                        
                        <rect x="0" y="360" rx="5" ry="5" width="250" height="20" /> 
                        
                        
                        <rect x="0" y="390" rx="5" ry="5" width="200" height="20" />
                    </ContentLoader>
            ))}
        </div>
    )
}

export default ToyListShimmer;
