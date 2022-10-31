import { Button, Form, Input, Select, Typography } from "antd";

const AtlasForm = ({
  onSubmit,
  user,
  onTypeChange,
  typesData,
  atlasData,
  values,
  setAtlasData,
  disableTranslate,
}) => {
  const { Option } = Select;

  const handleChangeInput = (e) => {
    const { name, valueAsNumber } = e.target;
    setAtlasData({ ...atlasData, [name]: valueAsNumber });
  };

  return (
    <Form
      fields={values}
      name="basic"
      style={{ width: "600px" }}
      onFinish={onSubmit}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 18 }}
    >
      {user?.role === "mod" && (
        <>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input title",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input description",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </>
      )}
      <Form.Item
        label="X1"
        name="x1"
        rules={[
          {
            required: true,
            message: "Please input x1",
          },
        ]}
      >
        <Input
          disabled={!disableTranslate}
          name="x1"
          onChange={handleChangeInput}
          type="number"
        />
      </Form.Item>
      <Form.Item
        label="X2"
        name="x2"
        rules={[
          {
            required: true,
            message: "Please input x2",
          },
        ]}
      >
        <Input
          disabled={!disableTranslate}
          name="x2"
          onChange={handleChangeInput}
          type="number"
        />
      </Form.Item>
      <Form.Item
        label="Y1"
        name="y1"
        rules={[
          {
            required: true,
            message: "Please input y1",
          },
        ]}
      >
        <Input
          disabled={!disableTranslate}
          name="y1"
          onChange={handleChangeInput}
          type="number"
        />
      </Form.Item>
      <Form.Item
        label="Y2"
        name="y2"
        rules={[
          {
            required: true,
            message: "Please input y2",
          },
        ]}
      >
        <Input
          disabled={!disableTranslate}
          name="y2"
          onChange={handleChangeInput}
          type="number"
        />
      </Form.Item>
      <Form.Item
        label="Type"
        name="type"
        rules={[
          {
            required: true,
            message: "Please choose type!",
          },
        ]}
      >
        <Select
          onChange={(value) => onTypeChange(value)}
          placeholder="Select type"
        >
          {typesData.map((type, index) => (
            <Option key={index} value={type._id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Text>{type.name}</Typography.Text>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "4px",
                    backgroundColor: type.color,
                    borderRadius: "6px",
                  }}
                ></div>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" htmlType="submit">
          {user?.role === "mod" ? "Submit Request" : "Submit"}
        </Button>
        <Button
          onClick={() => {
            setAtlasData(null);
          }}
          style={{ marginLeft: 8 }}
        >
          Clear
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AtlasForm;
