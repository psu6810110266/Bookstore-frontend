import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // เช็คว่ามี token ใน localStorage หรือไม่
  const isAuth = localStorage.getItem('userToken');

  // ถ้ามี -> ให้แสดงผลหน้านั้น (Outlet)
  // ถ้าไม่มี -> ดีดกลับไปหน้า /login
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;