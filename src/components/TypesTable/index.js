import { Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
const { Column } = Table;

const TypesTable = ({ handleOpenDeleteModal, handleOpenEditModal, data }) => {
  const typesPayload = () => {
    if (data) {
      return data.map((type) => {
        return {
          key: type._id,
          name: type.name,
          createdAt: dayjs(type.createdAt).format("DD/MM/YYYY hh:mm"),
          color: type.color,
        };
      });
    }
  };

  return (
    <Table dataSource={typesPayload()}>
      <Column title="Name" dataIndex="name" key="name" />
      <Column title="Created at" dataIndex="createdAt" key="createdAt" />
      <Column
        title="Color"
        dataIndex="color"
        key="color"
        render={(color) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginRight: "4px",
                backgroundColor: color,
                borderRadius: "6px",
              }}
            ></div>
            <Typography.Text code>{color}</Typography.Text>
          </div>
        )}
      />
      <Column
        title="Action"
        key="action"
        render={(_, record) => {
          return (
            <Space size="middle">
              <a onClick={() => handleOpenEditModal(record)}>Edit</a>
              <a onClick={() => handleOpenDeleteModal(record)}>Delete</a>
              <Link to={`/types/${_?.key}`}>3D scene</Link>
            </Space>
          );
        }}
      />
    </Table>
  );
};

export default TypesTable;
