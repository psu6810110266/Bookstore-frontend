import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { PlusOutlined, TrophyOutlined, SkinOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // ใช้สำหรับเปลี่ยนหน้า

const { Header } = Layout;
const { Title } = Typography;

export default function Navbar({ onNewBookClick, toggleTheme, isDarkMode, onLogout }) {
  const navigate = useNavigate();

  return (
    <Header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: isDarkMode ? '#001529' : '#fff',
      padding: '0 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      {/* 1. Logo / Brand */}
      <Title level={3} style={{ margin: 0, color: isDarkMode ? 'white' : '#333', cursor: 'pointer' }} onClick={() => navigate('/')}>
        My Book Store
      </Title>

      {/* 2. Menu Buttons */}
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onNewBookClick}>
          New Book
        </Button>

        <Button icon={<TrophyOutlined />} onClick={() => navigate('/top-books')}>
          Top Book
        </Button>

        <Button icon={<SkinOutlined />} onClick={toggleTheme}>
          {isDarkMode ? 'Light' : 'Dark'}
        </Button>

        <Button type="text" danger icon={<LogoutOutlined />} onClick={onLogout}>
          Log out
        </Button>
      </Space>
    </Header>
  );
}