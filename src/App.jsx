import './App.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './loginscreen';
import BookScreen from './BookScreen';
import { useState } from 'react'; // 1. อย่าลืม import useState

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  // 2. เปลี่ยนจาก localStorage เป็น State
  // กำหนดค่าเริ่มต้นเป็น false เสมอ เพื่อให้ทุกครั้งที่รีเฟรช (App โหลดใหม่) สถานะจะเป็น "ยังไม่ล็อกอิน"
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // สร้างฟังก์ชันสำหรับรับแจ้งว่า Login ผ่านแล้ว
  const handleLoginSuccess = (token) => {
      localStorage.setItem('token', token); // เก็บ token ไว้ใช้ยิง API (ถ้าจำเป็น)
      setIsAuthenticated(true); // เปลี่ยนสถานะใน RAM ให้เป็น Login แล้ว
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 3. ส่งฟังก์ชัน handleLoginSuccess ไปให้หน้า LoginScreen เรียกใช้ */}
        <Route 
            path="/login" 
            element={<LoginScreen onLogin={handleLoginSuccess} />} 
        />
        
        <Route 
          path="/main" 
          element={isAuthenticated ? <BookScreen /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App