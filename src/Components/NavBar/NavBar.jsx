import './NavBar.css';
import Logo from '../../assets/Logo/logo.png'
import Search from '../Search/Search.jsx'
import { TbTruckDelivery } from "react-icons/tb";
import {  AiOutlineUser } from "react-icons/ai";
import { IoBagHandleSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space , Modal } from 'antd';
import { logout } from '../../Slices/userSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const NavBar = (props) => {
  const isLoggedIn = props.isLoggedIn;
  const userDetails = props.userDetails;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((store)=>store.cart.items);
  let cartItemsCount ;
  if(cartItems){
    cartItemsCount = cartItems.length;
  }else{
    cartItemsCount = 0;
  }
  const handleLogout = () => {
     Modal.confirm({
      title: 'Logout',
      centered:true,
      content: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        dispatch(logout());
        toast.success('Logged out successfully')
        setTimeout(()=>{
          navigate('/')
        },500); 
      },
      closable:true
    });
  }

  const items = [{
    key: '0',
    label: 'Logout',
    onClick: handleLogout
  }]

  return (
    <div className="outer-container">
      <Link to="/">
        <img src={Logo} className='logo' alt="Logo" />
      </Link>
      <div className='right-container'>
        <Search />
        <div className='nav-attributes-container'>
          <Link to="/trackorder" className='nav-attributes'>
            <TbTruckDelivery size={30} />
            <div>Track Order</div>
          </Link>
          {isLoggedIn ? 
            <div className='nav-attributes'>
              <AiOutlineUser size={30} />
               <Dropdown
                  menu={{
                    items,
                  }}
                >
                  <Space>
                    {userDetails.name}
                    <DownOutlined />
                  </Space>
                </Dropdown>
            </div> :
            <Link to="/login" className='nav-attributes'>
              <AiOutlineUser size={30} />
              <div>Login</div>
            </Link>
          }
          <Link to="/cart" className='nav-attributes'>
            <IoBagHandleSharp size={30} />
            <div>My Bag</div>
            {cartItemsCount > 0 ? <div style={{paddingTop:'2px'}}> ({cartItemsCount})</div> : <div></div>}
          </Link>
        </div>
         <Link to="/cart" className='bag-attribute'>
            <IoBagHandleSharp size={24} />
            {cartItemsCount > 0 ? <div style={{paddingTop:'7px',fontSize:'10px'}}>({cartItemsCount})</div> : <div></div>}
          </Link>
      </div>
    </div>
  );
};

export default NavBar;