import { Space, Table } from "antd";
import dayjs from "dayjs";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

const UserTable = ({ data, openDeleteModal, openEditModal }) => {
  const { Column } = Table;
  const { user } = useContext(AppContext);
  const userPayload = () => {
    if (data) {
      return data.map((user) => {
        return {
          key: user._id,
          email: user.email,
          createdAt: dayjs(user.createdAt).format("DD/MM/YYYY hh:mm"),
          role: user.role,
        };
      });
    }
  };

  return (
    <Table dataSource={userPayload()}>
      <Column title="Email" dataIndex="email" key="email" />
      <Column title="Created at" dataIndex="createdAt" key="createdAt" />
      <Column title="Role" dataIndex="role" key="role" />
      <Column
        title="Action"
        key="action"
        render={(_, record) => {
          return (
            <Space size="middle">
              <a onClick={() => openEditModal(record)}>Edit</a>
              {user?.email !== record.email && (
                <a onClick={() => openDeleteModal(record)}>Delete</a>
              )}
            </Space>
          );
        }}
      />
    </Table>
  );
};

export default UserTable;
