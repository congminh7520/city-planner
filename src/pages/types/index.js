import axios from "axios";
import { Button, message } from "antd";
import { useContext, useEffect, useState } from "react";
import Loading from "../../components/Loading";
import config from "../../config";
import DashboardContentLayout from "../../layout/DashboardContent";
import TypesTable from "../../components/TypesTable";
import CreateTypesModal from "../../components/CreateTypesModal";
import DeleteTypesModal from "../../components/DeleteTypesModal";
import EditTypesModal from "../../components/EditTypesModal";
import AppContext from "../../context/AppContext";

const Types = () => {
  const [isLoad, setisLoad] = useState(false);
  const [typesData, setTypesData] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [alert, setAlert] = useState();
  const [currentType, setCurrentType] = useState();

  const { user } = useContext(AppContext);

  useEffect(() => {
    handleGetTypes();
  }, []);

  const handleOpenCreateModal = () => {
    setIsCreate(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreate(false);
  };

  const handleOpenDeleteModal = (type) => {
    setIsDelete(true);
    setCurrentType(type);
  };

  const handleCloseDeleteModal = () => {
    setIsDelete(false);
  };

  const handleOpenEditModal = (type) => {
    setIsEdit(true);
    setCurrentType(type);
  };

  const handleCloseEditModal = () => {
    setIsEdit(false);
  };

  const handleGetTypes = async () => {
    const { url, method } = config.paths.getAtlasItemTypes;
    setisLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
      });
      setisLoad(false);
      setTypesData(data.data);
    } catch (err) {
      setisLoad(false);
      console.error(err);
    }
  };

  const handleCreateType = async (payload) => {
    const { url, method } = config.paths.createAtlasItemTypes;
    setisLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: payload,
      });
      if (data.status === 200) {
        setisLoad(false);
        message.success("Create new type successfully");
        handleCloseCreateModal();
        handleGetTypes();
      } else {
        setAlert({ message: data.message, type: "error" });
      }
    } catch (err) {
      setisLoad(false);
      console.error(err);
    }
  };

  const handleDeleteType = async () => {
    const { url, method } = config.paths.deleteAtlasItemType;
    setisLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${currentType.key}`,
        method,
      });
      if (data.status === 200) {
        setisLoad(false);
        handleGetTypes();
        handleCloseDeleteModal();
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (err) {
      setisLoad(false);
      message.error(err.response.data.message);
    }
  };

  const handleEditType = async (payload) => {
    const { url, method } = config.paths.editAtlasItemType;
    setisLoad(true);
    delete payload.name;
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${currentType.key}`,
        method,
        data: payload,
      });
      if (data.status === 200) {
        setisLoad(false);
        handleGetTypes();
        handleCloseEditModal();
        message.success("Edit type success!");
      } else {
        message.error(data.message);
      }
    } catch (err) {
      setisLoad(false);
      console.error(err);
    }
  };

  return (
    <DashboardContentLayout
      prefix={
        <Button onClick={handleOpenCreateModal} type="primary">
          Create
        </Button>
      }
      title="Types"
    >
      {isLoad && <Loading />}
      {isCreate && (
        <CreateTypesModal
          onSubmit={handleCreateType}
          onCancel={handleCloseCreateModal}
          alert={alert}
          isVisible={isCreate}
        />
      )}
      {isEdit && (
        <EditTypesModal
          onSubmit={handleEditType}
          initValues={currentType}
          onCancel={handleCloseEditModal}
          isVisible={isEdit}
        />
      )}
      {isDelete && (
        <DeleteTypesModal
          onCancel={handleCloseDeleteModal}
          visible={isDelete}
          onOk={handleDeleteType}
        />
      )}
      <TypesTable
        user={user}
        handleOpenDeleteModal={handleOpenDeleteModal}
        handleOpenEditModal={handleOpenEditModal}
        data={typesData}
      />
    </DashboardContentLayout>
  );
};

export default Types;
