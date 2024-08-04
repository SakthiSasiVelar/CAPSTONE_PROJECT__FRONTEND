import React, { useState } from 'react';
import { Modal, Result, Button } from 'antd';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const OrderResultModal = ({ orderStatus }) => {
  const [isModalVisible, setIsModalVisible] = useState(true); 
  const navigate = useNavigate();

  const handleRetry = () => {
     setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    navigate('/')
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Modal
        title={orderStatus === 'success' ? 'Order Placed Successfully!' : 'Order Failed'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
          orderStatus !== 'success' && (
            <Button key="retry" onClick={handleRetry}>
              Retry
            </Button>
          ),
        ]}
      >
        {orderStatus === 'success' ? (
          <Result
            status="success"
            title="Thank you for your purchase!"
            icon={<SmileOutlined />}
          />
        ) : (
          <Result
            status="error"
            title="Something went wrong"
            subTitle="Sorry, something went wrong with your order. Please try again."
            icon={<CloseCircleOutlined />}
          />
        )}
      </Modal>
    </div>
  );
};

export default OrderResultModal;
