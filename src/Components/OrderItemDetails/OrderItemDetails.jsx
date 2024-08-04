import './OrderItemDetails.css'

const OrderItemDetails = (props) => {
    const cartItemToyDetailsList = props.cartItemToyDetailsList;
    const cartItemList = props.cartItemList;
    const categoryList = props.categoryList;
    const brandList = props.brandList;

    let newCartList = cartItemList.map((item) => {
        let cartItemToyDetails = cartItemToyDetailsList.find((toyDetails) => toyDetails.toyId === item.toyId);
        return {
            cartItemToyDetails: cartItemToyDetails,
            toyId : item.toyId,
            quantity: item.quantity,
            cartItemId : item.cartItemId
        }
    })

    function getCartItemPrice(discountPercent , price , quantity){
           let discountedPrice ;
           if(discountPercent > 0){
              discountedPrice = Math.floor((parseInt(price) - ((parseInt(price) * discountPercent)/100)));
           }
           else{
              discountedPrice = parseInt(price);
           }
           return discountedPrice * quantity;
    }

    function getBrandName(id){
        return brandList.find((brand) => brand.brandId === id).brandName;
    }

    return (
        <div className="order-item-details-container">
         <div className='order-item-detail-title'>{cartItemList.length} {cartItemList.length == 1 ? 'item' : 'items'} in your bag</div>
         {
            newCartList.map((item)=>{
                return (
                    <div key={item.cartItemId} className='order-item-container'>
                        <img src= {item.cartItemToyDetails.imageUrl}  className='order-item-image'/>
                        <div className='order-item-label-container'>
                            <div className='order-item-brand-name'>{ getBrandName(item.cartItemToyDetails.brandId)}</div>
                            <div className='order-item-name'>{item.cartItemToyDetails.name}</div>
                            <div className='quantity-price-container'>
                                <div className='order-item-quantity'>Qty : {item.quantity}</div>
                                <div>₹ {getCartItemPrice(item.cartItemToyDetails.discount , item.cartItemToyDetails.price , item.quantity)}</div>
                            </div>
                        </div>
                    </div>
                )
            })
         }
        </div>
    ) 
}

export default OrderItemDetails;