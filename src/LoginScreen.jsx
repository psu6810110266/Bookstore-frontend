import { useState } from 'react';
import { Button, Form, Input, Alert, Checkbox } from 'antd'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL_AUTH = "/api/auth/login"

export default function LoginScreen({ onLogin }) { 
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)
  
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    // 1. เช็คค่าก่อนว่า checkbox ส่งมาถูกไหม
    console.log("ข้อมูลทั้งหมดจาก Form:", formData);
    
    try {
      setIsLoading(true)
      setErrMsg(null)

      // ------------------------------------------------------------------
      // แก้ไขจุดที่ทำให้ Error 400: แยกข้อมูลก่อนส่ง
      // ------------------------------------------------------------------
      // ความหมาย: ดึงค่า 'remember' เก็บไว้ใช้เอง และเอาค่าที่เหลือ (User/Pass) ใส่ตัวแปร payload
      const { remember, ...payload } = formData; 

      console.log("ข้อมูลที่จะส่ง Server (payload):", payload); // เช็คดูว่าจะไม่มี remember ติดไป

      // ส่งเฉพาะ payload (ที่มีแค่ username, password) ไปหา Server
      const response = await axios.post(URL_AUTH, payload); 
      
      const token = response.data.access_token;
      
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      
      // ----------------------------------------------------
      // ใช้ค่า remember ที่แยกออกมา ตัดสินใจว่าจะเซฟไหม
      // ----------------------------------------------------
      if (remember === true) {
         console.log("เลือก Remember Me -> บันทึก Token ลงเครื่อง");
         localStorage.setItem('token', token);
      } else {
         console.log("ไม่เลือก Remember Me -> ไม่บันทึก (ใช้แค่ใน RAM)");
         localStorage.removeItem('token'); 
      }
      
      // ส่ง token ไปบอก App.js
      onLogin(token); 

      navigate('/main');

    } catch(err) { 
      console.log(err)
      // เพิ่มการแจ้งเตือนถ้าเป็น Error 400
      if (err.response && err.response.status === 400) {
        setErrMsg("Error 400: ข้อมูลที่ส่งไปไม่ถูกต้อง (Server ปฏิเสธ)");
      } else {
        setErrMsg(err.message);
      }
    } finally { 
      setIsLoading(false) 
    }
  }

  return(
    <Form
      onFinish={handleLogin}
      autoComplete="off"
      initialValues={{ remember: false }} 
    >
      {errMsg &&
        <Form.Item> <Alert message={errMsg} type="error" /> </Form.Item>
      }

      <Form.Item label="Username" name="username" rules={[{required: true,}]}>
        <Input />
      </Form.Item>
      
      <Form.Item label="Password" name="password" rules={[{required: true},]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}