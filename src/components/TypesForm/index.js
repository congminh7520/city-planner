import { Form, Input, Button } from "antd";

const TypesForm = ({ onSubmit, initialValues, isEdit }) => {
  return (
    <Form
      onFinish={onSubmit}
      initialValues={initialValues}
      name="basic"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input types name",
          },
        ]}
      >
        <Input disabled={isEdit} />
      </Form.Item>
      <Form.Item
        label="Color"
        name="color"
        wrapperCol={{ span: 3 }}
        rules={[
          {
            required: true,
            message: "Please input types color",
          },
        ]}
      >
        <Input type="color" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TypesForm;
