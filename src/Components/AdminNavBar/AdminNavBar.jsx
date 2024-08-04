import './AdminNavBar.css';
import { ShopOutlined, ProfileOutlined } from '@ant-design/icons';
import { Layout, Menu, Button,Modal } from 'antd';
import Logo from '../../assets/Logo/logo.png';
import AdminToyList from '../AdminToyList/AdminToyList';
import AdminOrderItemList from '../AdminOrderItemList/AdminOrderItemList';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Slices/userSlice';

const { Header, Sider, Content } = Layout;

const AdminNavBar = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState('1');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        setSelectedMenuItem(e.key);
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
        navigate('/'); 
      },
      closable:true
    });
  }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={250}>
                <div className="sidebar-header">Admin Panel</div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[selectedMenuItem]}
                    onClick={handleMenuClick}
                >
                    <Menu.Item key="1" icon={<ShopOutlined />}>
                        Toys
                    </Menu.Item>
                    <Menu.Item key="2" icon={<ProfileOutlined />}>
                        Order Items
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="site-layout-header" style={{ backgroundColor: 'rgb(172, 33, 40)', color: '#fff' }}>
                    <div className="header-content">
                        <img src={Logo} className='logo' alt="Logo" />
                        <Button type="primary" style={{ marginLeft: 'auto' }} onClick={handleLogout}>Logout</Button>
                    </div>
                </Header>
                <Content style={{ margin: '16px' }}>
                    {selectedMenuItem === '1' && <AdminToyList  />}
                    {selectedMenuItem === '2' && <AdminOrderItemList />}
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminNavBar;
