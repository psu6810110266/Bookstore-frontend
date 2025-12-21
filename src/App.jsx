import './App.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import หน้าจอต่างๆ
import LoginScreen from './LoginScreen'; // ตรวจสอบชื่อไฟล์ว่าตัวเล็ก/ใหญ่ตรงกันไหม
import BookScreen from './BookScreen';
import TopBooks from './TopBook'; // <-- [NEW] นำเข้าหน้า TopBooks ที่เราเพิ่งสร้าง

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  // ตรวจสอบ Token
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); 
  
  // --- [NEW THEME] เก็บค่าธีมไว้ที่นี่ (App เป็นคนถือค่ากลาง) ---
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ฟังก์ชันสลับธีม
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  useEffect(() => {
    // สั่งเปลี่ยนสี Body ของ Browser โดยตรง
    if (isDarkMode) {
      document.body.style.backgroundColor = "#141414"; // สีดำแบบ Ant Design
      document.body.style.color = "#ffffff";           // ตัวหนังสือสีขาว
    } else {
      document.body.style.backgroundColor = "#ffffff"; // สีขาวปกติ
      document.body.style.color = "#000000";           // ตัวหนังสือสีดำ
    }
  }, [isDarkMode]); // ทำงานทุกครั้งที่ isDarkMode เปลี่ยนค่า
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
       axios.defaults.headers.common['Authorization'] = `bearer ${storedToken}`;
    }
  }, []);

  const handleLoginSuccess = (token) => {
      setIsAuthenticated(true); 
  }

  const handleLogout = () => {
      // 1. ลบ Token
      localStorage.removeItem('token');
      // 2. ลบ Header axios
      delete axios.defaults.headers.common['Authorization'];
      // 3. เด้งออก
      setIsAuthenticated(false);
  }

  // ตัวช่วยเช็ค Authentication (Private Route Wrapper)
  // ถ้า login แล้วให้แสดงเนื้อหา ถ้ายังให้เด้งไป login
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />

        <Route 
            path="/login" 
            element={<LoginScreen onLogin={handleLoginSuccess} />} 
        />
        
        {/* --- หน้า Main (รายการหนังสือ) --- */}
        <Route 
          path="/main" 
          element={
            <PrivateRoute>
              {/* ส่งค่าธีม และ ฟังก์ชัน logout ลงไปให้ BookScreen ใช้ */}
              <BookScreen 
                 isDarkMode={isDarkMode} 
                 toggleTheme={toggleTheme} 
                 onLogout={handleLogout} 
              />
            </PrivateRoute>
          } 
        />

        {/* --- [NEW] หน้า Top Books (จัดอันดับ) --- */}
        <Route 
          path="/top-books" 
          element={
            <PrivateRoute>
              <TopBooks 
                 isDarkMode={isDarkMode} 
                 toggleTheme={toggleTheme} 
                 onLogout={handleLogout} 
              />
            </PrivateRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App