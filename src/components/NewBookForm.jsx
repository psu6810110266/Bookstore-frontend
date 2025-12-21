import React from 'react';
import { Button, Form, Select, Input, InputNumber, Row, Col } from 'antd';

const { TextArea } = Input;

export default function NewBookForm({ categories, onAdd }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // แปลงค่าให้ถูกต้องก่อนส่ง
    const payload = {
      ...values,
      price: Number(values.price),
      stock: Number(values.stock || 0),
      categoryId: Number(values.categoryId)
    };
    
    // ส่งข้อมูลกลับไปให้แม่ (BookScreen)
    onAdd(payload);
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Book Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input placeholder="Author Name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select 
              placeholder="Select" 
              options={categories} 
              // fieldNames เพื่อรองรับข้อมูลแบบ {id, name} ถ้า backend ส่งมาแบบนั้น
              fieldNames={{ label: 'label', value: 'value' }} 
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="stock" label="Stock" initialValue={0}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="description" label="Description">
        <TextArea rows={2} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="isbn" label="ISBN">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="coverUrl" label="Cover URL" rules={[{ type: 'url', warningOnly: true }]}>
            <Input placeholder="https://..." />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          Create Book
        </Button>
      </Form.Item>
    </Form>
  );
}