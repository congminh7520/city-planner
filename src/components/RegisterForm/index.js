import { Form, Input, Button, Select } from "antd";
import { Link } from "react-router-dom";

const RegisterForm = ({
  isEdit,
  isCreate,
  onSubmit,
  isRegister,
  initialValues,
}) => {
  const { Option } = Select;
  const roleOptions = [
    {
      value: "mod",
      label: "Moderator",
    },
    {
      value: "admin",
      label: "Admin",
    },
  ];
  return (
    <Form
      onFinish={onSubmit}
      initialValues={initialValues}
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
      {(!isEdit || isCreate) && (
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
      )}
      {(isEdit || isCreate) && (
        <Form.Item
          label="Role"
          name="role"
          rules={[
            {
              required: true,
              message: "Please choose role!",
            },
          ]}
        >
          <Select placeholder="Select role">
            {roleOptions.map((option, index) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {isRegister && (
        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Link to="/">Already have account?</Link>
        </Form.Item>
      )}

      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
