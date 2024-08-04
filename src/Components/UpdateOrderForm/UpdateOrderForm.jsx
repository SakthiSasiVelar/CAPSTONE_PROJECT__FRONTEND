import { Modal, Form, Input, Select } from 'antd';
import React from 'react';

const { Option } = Select;

const UpdateOrderForm = ({ visible, onClose, onUpdate, orderData }) => {
    const [form] = Form.useForm();

    const handleUpdate = () => {
        form.validateFields()
            .then(values => {
                onUpdate({ ...orderData, ...values });
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            open={visible}
            title="Update Order Status"
            okText="Update"
            onCancel={onClose}
            onOk={handleUpdate}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    orderItemId: orderData.orderItemId,
                    status: orderData.status,
                }}
            >
                <Form.Item
                    name="orderItemId"
                    label="Order Item ID"
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select a status' }]}
                >
                    <Select placeholder="Select status">
                        <Option value="Confirmed">Confirmed</Option>
                        <Option value="Shipped">Shipped</Option>
                        <Option value="Out for delivery">Out for Delivery</Option>
                        <Option value="Delivered">Delivered</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateOrderForm;
