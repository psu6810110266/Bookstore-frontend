import './App.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './loginscreen';
import BookScreen from './BookScreen';
import { useState, useEffect } from 'react';

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  // 1. ตรวจสอบ Token ใน LocalStorage ตั้งแต่เริ่มแอพ
  // ถ้ามี Token ค้างอยู่ (แสดงว่าเคยกด Remember) -> ให้ isAuthenticated = true
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token')); 

  useEffect(() => {
    // ถ้ามี Token ในเครื่อง ให้เอามาใส่ Header รอไว้เลย (กัน Error เวลายิง API)
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
       axios.defaults.headers.common['Authorization'] = `bearer ${storedToken}`;
    }
  }, []);

  // ฟังก์ชันนี้ทำงานเมื่อกดปุ่ม Login สำเร็จ
  const handleLoginSuccess = (token) => {
      // อัปเดต State ทันที เพื่อให้หน้าเว็บเปลี่ยนเป็น Main
      setIsAuthenticated(true); 
      // หมายเหตุ: ไม่ต้องสั่ง localStorage.setItem ตรงนี้แล้ว เพราะทำใน LoginScreen แล้ว
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route 
            path="/login" 
            element={<LoginScreen onLogin={handleLoginSuccess} />} 
        />
        
        {/* หน้า Main */}
        <Route 
          path="/main" 
          element={isAuthenticated ? <BookScreen /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App