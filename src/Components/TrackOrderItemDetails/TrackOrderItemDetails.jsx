import './TrackOrderItemDetails.css'
import {Divider} from 'antd'
import {Steps} from 'antd'

const TrackOrderItemDetails = (props) =>{
    const orderItemDetails = props.orderItemDetails;
    const toydetails = props.toyDetails;
    const orderDetails = props.orderDetails;

    const orderStatus = ['Confirmed' , 'Shipped' , 'Out for delivery' , 'Delivered'];

    const index = orderStatus.indexOf(orderItemDetails.orderItemStatus);

    function getMonthAndDate(timestamp){
        const date = new Date(timestamp);

        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(date);

        return formattedDate;

    }

    const lastOrderItemStatusDateTime = getMonthAndDate(orderItemDetails.statusActionDateTime);
  

    return (
        <div className="track-order-item-details-container">
           <div className='track-order-item-details-card'>
                <div className='track-order-item-details-item-info-container'>
                    <div className='track-order-item-details-item-info-img-container'>
                        <img src={toydetails.imageUrl} />
                    </div>
                    <div className='track-order-item-details-item-info-name-qty-container'>
                        <div>{toydetails.name}</div>
                        <div className='quantity-track-order-item'>Qty : {orderItemDetails.quantity}</div>
                        <div className='track-order-item-hight-detail price-font'>₹ {orderItemDetails.price}</div>
                    </div>
                </div>
                <Divider type='vertical' className='divider'/>
                <div className='track-order-item-details-delivery-address-container'>
                    <div className='track-order-item-hight-detail'>Delivery Address</div>
                    <div className='track-order-item-hight-detail'>{orderDetails.name.toUpperCase()}</div>
                    <div>{orderDetails.address}</div>
                    <div><span className='track-order-item-hight-detail'>Phone number</span> {orderDetails.contactNumber}</div>
                </div>
            </div>
            <div className='track-order-status-card'>
               <div className='track-order-item-hight-detail'>Order Status</div>
               <div>
                  <Steps
                  className='custom-steps'
                    progressDot
                    current={index}
                    items={[
                        {
                        title: 'Confirmed',
                        description : (index === 0 ? lastOrderItemStatusDateTime : '')
                        },
                        {
                        title: 'Shipped',
                        description : (index === 1? lastOrderItemStatusDateTime : '')
                        },
                        {
                        title: 'Out for delivery',
                        description : (index === 2 ? lastOrderItemStatusDateTime : '')
                        },
                        {
                        title: 'Delivered',
                        description : (index === 3? lastOrderItemStatusDateTime : '')
                        },
                    ]}
                    />
               </div>
            </div>
        </div>
    )
}

export default TrackOrderItemDetails;