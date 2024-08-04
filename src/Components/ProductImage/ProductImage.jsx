import './ProductImage.css'

const ProductImage = (props) => {
    return (
        <div className="product-image-container">
            <img src={props.imageUrl} alt={props.name} className='product-image' />
        </div>
    )
}

export default ProductImage;