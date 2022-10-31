import { Button, Form, message, Select } from "antd";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AtlasRequestTable from "../../components/AtlasRequestTable";
import Loading from "../../components/Loading";
import config from "../../config";
import DashboardContentLayout from "../../layout/DashboardContent";
import PreviewAtlasModal from "../../components/PreviewAtlasModal";
import DeleteRequestModal from "../../components/DeleteRequestModal";
import AppContext from "../../context/AppContext";
import { useForm } from "antd/lib/form/Form";

const AtlasRequest = () => {
  const { Option } = Select;
  const requestStatus = ["pending", "approved", "reject"];

  const [isLoad, setIsLoad] = useState(false);
  const [form] = useForm();
  const { user } = useContext(AppContext);
  const [requestPayload, setRequestPayload] = useState([]);
  const [currentRequest, setCurrentRequest] = useState();
  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isPreviewAll, setIsPreviewAll] = useState(false);
  const [queries, setQueries] = useState();
  const [previewRequest, setPreviewRequest] = useState([]);
  const initEditData = {
    ...currentRequest,
    ...currentRequest?.position,
  };
  delete initEditData.position;

  useEffect(() => {
    handleGetUsersList();
    fetchEditAtlasRequests();
  }, []);

  const openModalDelete = (request) => {
    setIsModalDelete(true);
    setCurrentRequest(request);
  };

  const closeModalDelete = () => {
    setIsModalDelete(false);
  };

  const handleOpenPreviewModal = (request) => {
    setIsOpenPreview(true);
    setCurrentRequest(request);
  };

  const handleClosePreviewModal = () => {
    setIsOpenPreview(false);
    setIsPreviewAll(false);
  };

  const handleGetUsersList = async () => {
    const { url, method } = config.paths.getUsers;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        params: { page: 1, perPage: 100 },
      });
      if (data.status === 200) {
        setIsLoad(false);
        setUserList(data.data);
      }
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const fetchEditAtlasRequests = async (params) => {
    const { url, method } = config.paths.getRequestEditMap;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        params,
      });
      setIsLoad(false);
      if (data.status === 200) {
        return setRequestPayload(data.data);
      } else {
        console.error(data);
      }
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const considerEditMap = async (status, id) => {
    const { url, method } = config.paths.considerRequestEditMap;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${id}`,
        method,
        data: {
          status,
        },
      });
      setIsLoad(false);
      if (data.status === 200) {
        message.success(data.message);
        fetchEditAtlasRequests();
        setIsOpenPreview(false);
      } else {
        console.error(data);
      }
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const considerEditManyMap = async (status) => {
    const { url, method } = config.paths.considerManyRequestEditMap;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: {
          ids: previewRequest,
          status,
        },
      });
      setIsLoad(false);
      if (data.status === 200) {
        message.success(data.message);
        fetchEditAtlasRequests();
        setIsOpenPreview(false);
        setIsPreviewAll(false);
        setQueries({});
        form.resetFields();
      } else {
        console.error(data);
      }
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const deleteRequestEditMap = async () => {
    const { url, method } = config.paths.deleteRequestEditMap;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${currentRequest.key}`,
        method,
      });
      setIsLoad(false);
      if (data.status === 200) {
        message.success(data.message);
        closeModalDelete();
        fetchEditAtlasRequests();
      } else {
        console.error(data);
      }
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const handlePreviewAllRequest = () => {
    setCurrentRequest({
      image: `${
        config.app.mapHost
      }?size=0&width=5012&height=5012&isRequest=1&requestIds=${previewRequest.join(
        ","
      )}`,
    });
    setIsOpenPreview(true);
    setIsPreviewAll(true);
  };

  const handleQuery = (data) => {
    fetchEditAtlasRequests(data);
    setQueries(data);
  };

  return (
    <DashboardContentLayout
      prefix={
        previewRequest?.length > 0 && (
          <Button type="primary" onClick={handlePreviewAllRequest}>
            Preview
          </Button>
        )
      }
      title="Edit atlas requests"
    >
      {user?.role === "admin" && (
        <Form
          form={form}
          onFinish={handleQuery}
          style={{ display: "flex", gap: "12px", marginBottom: "16px" }}
        >
          <Form.Item name="userId">
            <Select
              style={{ width: "200px" }}
              showSearch
              placeholder="Select a user"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="">All users</Option>
              {userList?.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="Select a status" style={{ width: "150px" }}>
              <Option value="">All status</Option>
              {requestStatus?.map((stat) => (
                <Option key={stat} value={stat}>
                  {stat}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </Form>
      )}
      {isLoad && <Loading />}
      {isOpenPreview && (
        <PreviewAtlasModal
          requestAtlasPayload={{
            ...currentRequest.position,
            ...currentRequest,
          }}
          onCancel={handleClosePreviewModal}
          visible={isOpenPreview}
          footer={null}
          onConsider={isPreviewAll ? considerEditManyMap : considerEditMap}
        />
      )}
      <DeleteRequestModal
        onOk={deleteRequestEditMap}
        onCancel={closeModalDelete}
        visible={isModalDelete}
      />
      <AtlasRequestTable
        setPreviewRequest={setPreviewRequest}
        data={requestPayload}
        openModalDelete={openModalDelete}
        handleOpenPreviewModal={handleOpenPreviewModal}
        considerEditMap={considerEditMap}
      />
    </DashboardContentLayout>
  );
};

export default AtlasRequest;
