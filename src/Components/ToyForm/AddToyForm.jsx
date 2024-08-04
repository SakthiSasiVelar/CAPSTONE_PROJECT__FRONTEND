import React from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { API_BASE_URL } from '../../utils/config';


const { Option } = Select;

const AddToyForm = ({ visible, onClose, onAdd , categoryList , brandList}) => {
    const [form] = useForm();

    const handleSubmit = (values) => {
        onAdd(values);
        form.resetFields();
    };

    return (
        <Modal
            open={visible}
            title="Add New Toy"
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
                    name="name"
                    label="Toy Name"
                    rules={[{ required: true, message: 'Please input the toy name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="categoryId"
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
                    name="brandId"
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
                        <Option value="5-7years">5-7years </Option>
                        <Option value="8-10years">8-10years </Option>
                        <Option value="10-12years">10-12years </Option>
                        <Option value="12-14years">12-14years </Option>                  
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
                     rules={[{ required: true, message: 'Please input the discount!' }]}
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

                <Form.Item
                    name="image"
                    label="Image Upload"
                     rules={[{ required: true, message: 'Please upload the image!' }]}
                >
                    <Upload
                        action={API_BASE_URL + 'image/upload'}
                        listType="picture"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: 'black', borderColor: 'black' }}
                    >
                        Add Toy
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddToyForm;
