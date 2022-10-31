import { Space, Table, Typography } from "antd";
import dayjs from "dayjs";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
const { Column } = Table;

const AtlasRequestTable = ({
  openModalDelete,
  handleOpenPreviewModal,
  considerEditMap,
  setPreviewRequest,
  data,
}) => {
  const { user } = useContext(AppContext);

  const requestPayload = () => {
    if (data) {
      return data.map((request) => {
        console.log(request);
        return {
          key: request._id,
          createdAt: dayjs(request.createdAt).format("DD/MM/YYYY hh:mm"),
          position: request.coords,
          createdBy: request.user.email,
          ...request,
        };
      });
    }
  };

  return (
    <Table
      rowSelection={{
        type: "checkbox",
        onChange: (key, selectRows) => {
          setPreviewRequest(selectRows.map((row) => row._id));
        },
        getCheckboxProps: (record) => ({
          disabled: record?.status !== "pending",
          name: record?.status,
        }),
      }}
      dataSource={requestPayload()}
    >
      <Column title="Title" dataIndex="title" key="title" />
      <Column title="Description" dataIndex="description" key="description" />
      <Column
        title="Type"
        dataIndex="type"
        key="type"
        render={(type) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "4px",
                  backgroundColor: type.color,
                  borderRadius: "6px",
                }}
              ></div>
              <Typography.Text code>{type.name}</Typography.Text>
            </div>
          );
        }}
      />
      <Column title="Created by" dataIndex="createdBy" key="createdBy" />
      <Column title="Status" dataIndex="status" key="status" />
      <Column
        title="Action"
        key="action"
        render={(_, record) => {
          if (record.status === "pending") {
            return (
              <Space size="middle">
                <a
                  onClick={() =>
                    handleOpenPreviewModal({
                      ...record,
                      type: record.type._id,
                    })
                  }
                >
                  Preview
                </a>
                {user?.role === "admin" && (
                  <>
                    <a onClick={() => considerEditMap("approve", record.key)}>
                      Approve
                    </a>
                    <a onClick={() => considerEditMap("reject", record.key)}>
                      Reject
                    </a>
                  </>
                )}
                {user?.role === "mod" && (
                  <a onClick={() => openModalDelete(record)}>Cancel</a>
                )}
              </Space>
            );
          }
        }}
      />
    </Table>
  );
};

export default AtlasRequestTable;
