import React from 'react';
import { Spin } from 'antd';
import './LoadingSpinner.css';

const LoadingSpinner = () => (
    <div className="spinner-overlay">
        <Spin size="large" />
    </div>
);

export default LoadingSpinner;
