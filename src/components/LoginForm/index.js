import { Form, Input, Checkbox, Button } from "antd";
import { Link } from "react-router-dom";
import styles from "./login.module.css";

const LoginForm = ({onSubmit}) => {
  return (
    <Form
      onFinish={onSubmit}
      name="basic"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email",
          },
          {
            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
            message: "Please enter the correct email pattern",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 5, span: 16 }}
        name="remember"
        valuePropName="checked"
      >
        <div className={styles.action}>
          <Checkbox>Remember me</Checkbox>
          <span className={styles.or}>or</span>
          <Link to="/register">Register now</Link>
        </div>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
