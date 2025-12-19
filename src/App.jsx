import './App.css'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './loginscreen';
import BookScreen from './BookScreen';

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  // เช็ค Token
  const isAuthenticated = !!localStorage.getItem('token'); 

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. เมื่อเข้า localhost:5173 เฉยๆ ให้ดีดไปหน้า Login ทันที */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. หน้า Login */}
        <Route path="/login" element={<LoginScreen />} />
        
        {/* 3. หน้าหลักชื่อ "main" (ถ้ายังไม่ Login ให้ดีดกลับไป Login) */}
        <Route 
          path="/main" 
          element={isAuthenticated ? <BookScreen /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App