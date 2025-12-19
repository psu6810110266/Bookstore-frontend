import { useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL_AUTH = "/api/auth/login"

// 1. รับ props ชื่อ onLogin เข้ามา (ใส่ปีกกา {} ครอบด้วย)
export default function LoginScreen({ onLogin }) { 
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState(null)
  
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      setIsLoading(true)
      setErrMsg(null)
      const response = await axios.post(URL_AUTH, formData);
      const token = response.data.access_token;
      
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      
      // เก็บ Token ลง LocalStorage ได้ (เอาไว้ใช้ยิง API) 
      // แต่สถานะการ "เข้าหน้าเว็บ" เราจะใช้ State แทน
      localStorage.setItem('token', token); 
      
      // 2. เรียกใช้ props เพื่อบอก App.js ว่า "ล็อกอินสำเร็จแล้ว เปลี่ยน State ได้เลย"
      onLogin(token); 

      // สั่งเปลี่ยนหน้า
      navigate('/main');

    } catch(err) { 
      console.log(err)
      setErrMsg(err.message)
    } finally { 
      setIsLoading(false) 
    }
  }

  return(
    <Form onFinish={handleLogin} autoComplete="off">
      {/* ... (ส่วน UI ของคุณเหมือนเดิม ไม่ต้องแก้) ... */}
       {errMsg &&
        <Form.Item>
          <Alert message={errMsg} type="error" />
        </Form.Item>
      }

      <Form.Item
        label="Username"
        name="username"
        rules={[{required: true,}]}>
        <Input />
      </Form.Item>
      
      <Form.Item
        label="Password"
        name="password"
        rules={[{required: true},]}>
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button 
            type="primary" 
            htmlType="submit" loading={isLoading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}