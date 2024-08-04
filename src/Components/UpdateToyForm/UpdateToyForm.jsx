import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber } from 'antd';
import { useForm } from 'antd/es/form/Form';

const { Option } = Select;

const UpdateToyForm = ({ visible, onClose, onUpdate, toyData, categoryList, brandList }) => {
    const [form] = useForm();

    useEffect(() => {
        if (toyData) {
            form.setFieldsValue(toyData);
        }
    }, [toyData, form]);

    const handleSubmit = (values) => {
        onUpdate(values);
        form.resetFields();
    };

    return (
        <Modal
            open={visible}
            title="Update Toy"
            onCancel={onClose}
            footer={null}
            centered
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="toyId"
                    label="Toy ID"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="name"
                    label="Toy Name"
                    rules={[{ required: true, message: 'Please input the toy name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select>
                       {categoryList.map(category => (
                            <Option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="brand"
                    label="Brand"
                    rules={[{ required: true, message: 'Please select a brand!' }]}
                >
                    <Select>
                        {brandList.map(brand => (
                            <Option key={brand.brandId} value={brand.brandId}>
                                {brand.brandName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="ageRange"
                    label="Age Range"
                    rules={[{ required: true, message: 'Please select an age range!' }]}
                >
                    <Select>
                       <Option value="0-18months">0-18 months</Option>
                        <Option value="2-5years">2-5 years</Option>
                        <Option value="5-7years">5-7 years</Option>
                        <Option value="8-10years">8-10 years</Option>
                        <Option value="10-12years">10-12 years</Option>
                        <Option value="12-14years">12-14 years</Option>   
                    </Select>
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: 'Please input the price!' }]}
                >
                    <InputNumber min={0} step={0.01} prefix="₹" />
                </Form.Item>

                <Form.Item
                    name="discount"
                    label="Discount"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: 'Please input the quantity!' }]}
                >
                    <InputNumber min={0} />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: 'green', borderColor: 'green' }}
                    >
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateToyForm;
