import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Badge, Spin, Button, Empty } from 'antd';
import { CrownOutlined, ArrowLeftOutlined, FileImageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar'; 

const URL_BOOK = "/api/book";
const ribbonColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

// 👇👇 1. แก้ Port เป็น 3080 ให้ตรงกับ BookList.jsx 👇👇
const BACKEND_BASE_URL = "http://localhost:3080"; 

// 👇👇 2. ฟังก์ชันช่วยเติม URL (เลียนแบบ Logic ของ BookList) 👇👇
const getImageUrl = (url) => {
  if (!url) return null;
  
  // ถ้ามี http อยู่แล้วก็ใช้เลย
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // ตัดเครื่องหมาย / ตัวหน้าออก (ถ้ามี) เพื่อไม่ให้ซ้ำกับ Base URL
  const cleanPath = url.startsWith('/') ? url.substring(1) : url;

  // คืนค่าแบบเดียวกับ BookList: http://localhost:3080/ชื่อไฟล์
  return `${BACKEND_BASE_URL}/${cleanPath}`;
};

export default function TopBooks({ isDarkMode, toggleTheme, onLogout }) {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const response = await axios.get(URL_BOOK);
        const sorted = response.data
          .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
          .slice(0, 3);
        setTopBooks(sorted);
      } catch (error) {
        console.error("Error fetching top books", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopBooks();
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '20px' }}>
      <Navbar 
        onNewBookClick={() => navigate('/')}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        onLogout={onLogout}
      />
      
      <div style={{ padding: '0 20px', maxWidth: '900px', margin: '0 auto' }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: 10 }}>
            Back to Home
        </Button>
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: '30px',color: isDarkMode ? '#fff' : '#000'   }}>
          <CrownOutlined style={{ color: '#FFD700', marginRight: 10 }} />
          Top 3 Most Liked Books
        </Typography.Title>

        <Spin spinning={loading}>
          <List
            itemLayout="vertical"
            dataSource={topBooks}
            locale={{ emptyText: <Empty description="No books data found" /> }}
            renderItem={(item, index) => (
              <List.Item>
                <Badge.Ribbon 
                    text={`#${index + 1}`} 
                    color={ribbonColors[index] || 'orange'}
                    placement="start"
                >
                  <Card hoverable bodyStyle={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                      
                      {/* --- ส่วนรูปภาพ --- */}
                      <div style={{ 
                          flexShrink: 0,
                          width: '120px', 
                          height: '180px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: isDarkMode ? '1px solid #333' : '1px solid #f0f0f0',
                          backgroundColor: isDarkMode ? '#1f1f1f' : '#fafafa',
                          display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}>
                        {item.coverUrl ? (
                          <img 
                            // 👇👇 3. เรียกใช้ฟังก์ชันที่เราแก้แล้ว 👇👇
                            src={getImageUrl(item.coverUrl)} 
                            alt={item.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.style.display = 'none'; 
                                e.target.nextSibling.style.display = 'flex'; 
                            }}
                          />
                        ) : null}
                        
                        <div style={{ display: item.coverUrl ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', color: '#999' }}>
                             <FileImageOutlined style={{ fontSize: '24px', marginBottom: '5px' }} />
                             <small>No Cover</small>
                        </div>
                      </div>

                      {/* --- ส่วนเนื้อหา (เหมือนเดิม) --- */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography.Title level={4} style={{ margin: '0 0 5px 0' }}>{item.title}</Typography.Title>
                        <Typography.Text type="secondary" style={{ marginBottom: '10px' }}>By {item.author}</Typography.Text>
                        <div style={{ marginBottom: '15px' }}>
                             <Typography.Text strong style={{ fontSize: '1.1rem', color: '#ff4d4f' }}>{item.likeCount || 0} ❤️ Likes</Typography.Text>
                        </div>
                        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'read more' }} style={{ marginBottom: 0 }}>
                          {item.description || "No description available."}
                        </Typography.Paragraph>
                        {item.isbn && (
                          <Typography.Text type="secondary" style={{ fontSize: '0.85rem', marginTop: '10px' }}>ISBN: {item.isbn}</Typography.Text>
                        )}
                      </div>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </List.Item>
            )}
          />
        </Spin>
      </div>
    </div>
  );
}