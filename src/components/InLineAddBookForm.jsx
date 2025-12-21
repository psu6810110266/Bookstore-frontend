import { Button, Form, Select, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function InlineAddBook(props) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    // ส่งค่ากลับไปที่ Parent Component
    props.onBookAdded({
      ...values,
      // แปลงค่าให้มั่นใจว่าเป็น number (กันเหนียว)
      price: Number(values.price),
      stock: Number(values.stock),
    });
    form.resetFields(); // ล้างค่าในฟอร์มหลังจากกดส่ง
  };

  return (
    <Form 
      form={form} 
      layout="inline" 
      onFinish={onFinish}
      style={{ marginBottom: '20px' }} // เว้นระยะห่างด้านล่างหน่อย
    >
      <Form.Item name="title" rules={[{ required: true, message: 'Missing title' }]}>
        <Input placeholder="Title" />
      </Form.Item>

      <Form.Item name="author" rules={[{ required: true, message: 'Missing author' }]}>
        <Input placeholder="Author" />
      </Form.Item>

      <Form.Item name="price" rules={[{ required: true, message: 'Missing price' }]}>
        <InputNumber placeholder="Price" min={0} style={{ width: 100 }} />
      </Form.Item>

      <Form.Item name="stock" rules={[{ required: true, message: 'Missing stock' }]}>
        <InputNumber placeholder="Stock" min={0} style={{ width: 100 }} />
      </Form.Item>

      <Form.Item name="categoryId" rules={[{ required: true, message: 'Select Category' }]}>
        <Select 
          placeholder="Category"
          style={{ width: 150 }} 
          options={props.categories} 
          // options ควรมีหน้าตา { label: 'Fantasy', value: 1 }
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}