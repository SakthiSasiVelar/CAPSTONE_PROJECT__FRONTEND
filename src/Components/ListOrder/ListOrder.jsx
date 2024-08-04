import './ListOrder.css'
import { GoDotFill } from "react-icons/go";
import { Link } from 'react-router-dom'

const ListOrder = (props) => {
    const orderItemList = props.orderItemList;
    const toyDetailsList = props.toyDetailsList;

    let getOrderItemAndToyList = orderItemList.map((orderItem) =>{
        let orderItemToyDetails = toyDetailsList.find((toyDetails) => toyDetails.toyId === orderItem.toyId);
        return {
            orderItem: orderItem,
            toyDetails: orderItemToyDetails
        }
    });

    function getMonthAndDate(timestamp){
        const date = new Date(timestamp);

        const options = { year: 'numeric' , month: 'short', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-IN', options).format(date);

        return formattedDate;

    }


    return (
        <div className='list-order-container'>
            <h2>My Orders</h2>
            {
                getOrderItemAndToyList.map((item) => {
                   return ( 
                    <Link to={`/trackOrder/${item.orderItem.orderItemId}`} key={item.orderItem.orderItemId} className='link-container'>
                        <div className='order-card-container'>
                            <div className='order-card-img-container'>
                                <img src={item.toyDetails.imageUrl} className='order-card-img' />
                            </div>
                            <div className='order-card-item-name-container'>
                                <div className='order-card-item-name'>{item.toyDetails.name}</div>
                                <div className='order-card-item-quantity'>Qty : {item.orderItem.quantity}</div>
                            </div>
                            <div className='order-card-item-price-container'>
                            <div>₹ {item.orderItem.price}</div>
                            </div>
                            <div className='order-card-item-status-container'>
                                {item.orderItem.orderItemStatus === 'Out for delivery' ?  <GoDotFill  className='Out-for-delivery'/> : 
                                <GoDotFill  className={item.orderItem.orderItemStatus}/>
                                }
                                <div className='order-card-item-status'>{item.orderItem.orderItemStatus} on {getMonthAndDate(item.orderItem.statusActionDateTime)}</div>
                            </div>
                        </div> 
                   </Link>
                   )
                })
            }
        </div>
    )
}

export default ListOrder;