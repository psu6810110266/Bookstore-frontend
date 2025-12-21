import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox, Typography, Card } from 'antd'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL_AUTH = "/api/auth/login"
const { Title } = Typography; // ประกาศตัวแปร Title

export default function LoginScreen({ onLogin }) { 
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)
  
  const navigate = useNavigate();

  // --- LOGIC ส่วนการ Login (เหมือนเดิม 100% เพื่อไม่ให้กระทบการทำงาน) ---
  const handleLogin = async (formData) => {
    console.log("ข้อมูลทั้งหมดจาก Form:", formData);
    
    try {
      setIsLoading(true)
      setErrMsg(null)

      // แยกข้อมูล remember ออกจาก payload
      const { remember, ...payload } = formData; 

      console.log("ข้อมูลที่จะส่ง Server (payload):", payload);

      // ส่ง API
      const response = await axios.post(URL_AUTH, payload); 
      
      const token = response.data.access_token;
      
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      
      // จัดการ Remember Me
      if (remember === true) {
         console.log("เลือก Remember Me -> บันทึก Token ลงเครื่อง");
         localStorage.setItem('token', token);
      } else {
         console.log("ไม่เลือก Remember Me -> ไม่บันทึก (ใช้แค่ใน RAM)");
         localStorage.removeItem('token'); 
      }
      
      onLogin(token); 
      navigate('/main');

    } catch(err) { 
      console.log(err)
      if (err.response && err.response.status === 400) {
        setErrMsg("Error 400: ข้อมูลที่ส่งไปไม่ถูกต้อง (Server ปฏิเสธ)");
      } else {
        setErrMsg(err.message);
      }
    } finally { 
      setIsLoading(false) 
    }
  }

  // --- UI ส่วนแสดงผล (ปรับปรุงใหม่ เพิ่ม Title, Card, จัดกลาง) ---
  return(
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column',
      backgroundColor: '#f0f2f5' // ใส่สีพื้นหลังให้อ่อนๆ ดูสบายตาขึ้น
    }}>
      
      {/* 1. ส่วนหัวข้อ Welcome */}
      <Title level={2} style={{ marginBottom: '24px', color: '#1890ff' }}>
        Welcome to Bookstore
      </Title>

      {/* 2. การ์ด Login */}
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form
          onFinish={handleLogin}
          autoComplete="off"
          initialValues={{ remember: false }} 
          layout="vertical" // จัดฟอร์มเป็นแนวตั้ง (Label อยู่บน Input) จะสวยกว่าใน Card
        >
          {/* ส่วนแจ้งเตือน Error */}
          {errMsg &&
            <Form.Item> 
              <Alert message={errMsg} type="error" showIcon /> 
            </Form.Item>
          }

          <Form.Item label="Username" name="username" rules={[{required: true, message: 'Please input your username!'}]}>
            <Input placeholder="Enter username" />
          </Form.Item>
          
          <Form.Item label="Password" name="password" rules={[{required: true, message: 'Please input your password!'}]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
    </div>
  )
}