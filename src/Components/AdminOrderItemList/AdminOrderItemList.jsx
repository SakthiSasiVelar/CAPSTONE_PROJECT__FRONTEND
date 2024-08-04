import { Button, Table, Space, Dropdown, Menu } from 'antd';
import { EditOutlined, FilterOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/config';
import { formatErrorMessage, formatSuccessMessage } from '../../utils/responseFormatter';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from '../Spinner/LoadingSpinner';
import UpdateOrderForm from '../UpdateOrderForm/UpdateOrderForm';

const AdminOrderItemList = () => {
    const [orderItems, setOrderItems] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toyDetailList, setToyDetailList] = useState(null);
    const [filteredOrderItems, setFilteredOrderItems] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
    const token = sessionStorage.getItem('token');
    let newOrderItemList;

    async function callFetchOrderItemsApi() {
        try {
            const response = await fetch(API_BASE_URL + 'orderItem/getAll', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorCode = response.status;
                switch (errorCode) {
                    case 401:
                        return formatErrorMessage(401, 'Unauthorized');
                    case 403:
                        return formatErrorMessage(403, 'Forbidden');
                }
            }
            const result = await response.json();

            if (result.status === 'success') {
                setOrderItems(result.data);
                setFilteredOrderItems(result.data);
                return formatSuccessMessage(200, 'Order items fetched successfully', result.data);
            } else {
                const errorCode = result.statusCode;
                switch (errorCode) {
                    case 400:
                        return formatErrorMessage(400, 'Please check the input');
                    case 500:
                        return formatErrorMessage(500, 'Error in fetching order items');
                    default:
                        return formatErrorMessage(errorCode, result.message);
                }
            }
        } catch (error) {
            return error;
        }
    }

    async function callFetchToyDetailsApi(toyIdList) {
        try {
            const response = await fetch(API_BASE_URL + 'toy/getList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toyIdList)
            });

            if (!response.ok) {
                const errorCode = response.status;
                switch (errorCode) {
                    case 401:
                        return formatErrorMessage(401, 'Unauthorized');
                }
            }
            const result = await response.json();

            if (result.status === 'success') {
                return formatSuccessMessage(201, 'Toy List Details fetched successfully', result.data);
            } else if (result.status === 'error') {
                const errorCode = result.statusCode;
                switch (errorCode) {
                    case 400:
                        return formatErrorMessage(400, 'Please check the input and try again');
                    case 500:
                        return formatErrorMessage(500, 'Failed to fetch toy list details. Please try again');
                    default:
                        return formatErrorMessage(errorCode, result.message);
                }
            }
        } catch (error) {
            return error;
        }
    }

    function getToyIdList(orderItemsList) {
        if (orderItemsList.length > 0) {
            return [...new Set(orderItemsList.map((item) => item.toyId))];
        } else {
            return [];
        }
    }

    useEffect(() => {
        async function fetchToyDetails(toyIdList) {
            let newToyIdDetails = {
                toyIdList: toyIdList
            }
            try {
                const result = await callFetchToyDetailsApi(newToyIdDetails);
                if (result.status === 'success') {
                    setToyDetailList(result.data);
                } else {
                    console.log(result);
                    toast.error('Please refresh the page')
                }
            } catch (error) {
                console.log(error);
                toast.error('Please try again')
            }
        }

        async function fetchOrderItems() {
            try {
                const result = await callFetchOrderItemsApi();
                if (result.status === 'success') {
                    setOrderItems(result.data);
                    setFilteredOrderItems(result.data);
                    let toyIdList = getToyIdList(result.data);
                    if (toyIdList.length > 0) {
                        await fetchToyDetails(toyIdList);
                    }
                } else {
                    if (result.errorCode === 401 || result.errorCode === 403) {
                        toast.error('Please login as admin to get order items');
                        return;
                    }
                    toast.error('Failed to fetch order items')
                }
            } catch (error) {
                console.log(error);
                toast.error('Please try again')
            }
        }

        fetchOrderItems();

    }, []);

    function getToyNameById(id) {
        if (toyDetailList && toyDetailList.length > 0) {
            let toyDetail = toyDetailList.find((toy) => toy.toyId === id);
            if (toyDetail) {
                return toyDetail.name;
            }
        }
        return '';
    }

    if (orderItems !== null && toyDetailList !== null) {
        newOrderItemList = filteredOrderItems.map((orderItem) => {
            return {
                orderItemId: orderItem.orderItemId,
                name: getToyNameById(orderItem.toyId),
                price: orderItem.price,
                quantity: orderItem.quantity,
                status: orderItem.orderItemStatus,
            }
        });
    }

    const orderColumns = [
        { title: 'OrderItemId', dataIndex: 'orderItemId', key: 'orderItemId' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `₹${price}` },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedOrder(record);
                            setUpdateVisible(true);
                        }}
                    >
                        Update
                    </Button>
                </Space>
            ),
        },
    ];

    const filterMenu = (
        <Menu
            onClick={(e) => {
                setFilterStatus(e.key);
                const filteredItems = orderItems.filter(item => item.orderItemStatus === e.key);
                setFilteredOrderItems(filteredItems);
            }}
        >
            <Menu.Item key="Confirmed">Confirmed</Menu.Item>
            <Menu.Item key="Shipped">Shipped</Menu.Item>
            <Menu.Item key="Out for delivery">Out for Delivery</Menu.Item>
            <Menu.Item key="Delivered">Delivered</Menu.Item>
        </Menu>
    );

    async function updateOrderStatusApi(orderDetails) {
        try {
            const response = await fetch(API_BASE_URL + 'orderItem/updateStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderDetails)
            });

            if (!response.ok) {
                const errorCode = response.status;
                switch (errorCode) {
                    case 401:
                        return formatErrorMessage(401, 'Unauthorized');
                    case 403:
                        return formatErrorMessage(403, 'Forbidden');
                }
            }
            const result = await response.json();

            if (result.status === 'success') {
                return formatSuccessMessage(201, 'Order status updated successfully', result.data);
            } else {
                const errorCode = result.statusCode;
                switch (errorCode) {
                    case 400:
                        return formatErrorMessage(400, 'Please check the input and try again');
                    case 500:
                        return formatErrorMessage(500, 'Failed to update order status. Please try again');
                    default:
                        return formatErrorMessage(errorCode, result.message);
                }
            }
        } catch (error) {
            return error;
        }
    }

    async function updateOrderStatus(orderDetails) {
        let newOrderDetails = {
            orderItemStatus: orderDetails.status,
            orderItemId: orderDetails.orderItemId,
        }
        try {
            const result = await updateOrderStatusApi(newOrderDetails);
            if (result.status === 'success') {
                setOrderItems((prev) => {
                    const updatedOrderItems = prev.map(item =>
                        item.orderItemId === result.data.orderItemId ? { ...item, ...result.data } : item
                    );
                    setFilteredOrderItems(updatedOrderItems.filter(item => filterStatus ? item.orderItemStatus === filterStatus : true));
                    return updatedOrderItems;
                });
                setIsLoading(false);
                toast.success('Order Item status updated successfully');
            } else {
                if (result.errorCode === 401 || result.errorCode === 403) {
                    toast.error('Please login as admin to update order status');
                    setIsLoading(false)
                    return
                }
                toast.error('Failed to update order status');
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Failed to update order status');
            setIsLoading(false);
        }
    }

    const handleUpdate = (values) => {
        setUpdateVisible(false);
        setIsLoading(true);
        updateOrderStatus(values);
        setSelectedOrder(null);
    };

    if (orderItems === null || toyDetailList === null) return null;

    return (
        <div>
            <Space style={{ float: 'right', marginBottom: '16px' }}>
                <Dropdown overlay={filterMenu} trigger={['click']}>
                    <Button icon={<FilterOutlined />}>Filter by Status</Button>
                </Dropdown>
            </Space>
            {isLoading && <LoadingSpinner />}
            <Table
                columns={orderColumns}
                dataSource={newOrderItemList}
                pagination={{ pageSize: 8 }}
                style={{ marginBottom: '16px' }}
                key="orderItemId"
            />
            {selectedOrder && (
                <UpdateOrderForm
                    visible={updateVisible}
                    onClose={() => setUpdateVisible(false)}
                    onUpdate={handleUpdate}
                    orderData={selectedOrder}
                />
            )}
        </div>
    );
};

export default AdminOrderItemList;
