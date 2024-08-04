import React from 'react';
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { Link } from 'react-router-dom';
import './FootBar.css';

const FooterBar = () => {
  return (
    <div className="footer-bar">
      <Link to="/" className="footer-item">
        <AiOutlineHome size={24} />
        <div>Home</div>
      </Link>
      <Link to="/trackOrder" className="footer-item">
        <TbTruckDelivery size={24} />
        <div>Track Order</div>
      </Link>
      <Link to="/login" className="footer-item">
        <AiOutlineUser size={24} />
        <div>Account</div>
      </Link>
    </div>
  );
};

export default FooterBar;
