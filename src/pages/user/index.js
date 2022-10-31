import { DashboardContent } from "../../layout";
import { Button, message } from "antd";
import UserTable from "../../components/UserTable";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalCreateUser from "../../components/CreateUserModal";
import Loading from "../../components/Loading";
import config from "../../config";
import axios from "axios";
import DeleteUserModal from "../../components/DeleteUserModal";
import ModalEditUser from "../../components/EditUserModal";
import AppContext from "../../context/AppContext";

const User = () => {
  const initAlert = {
    message: "",
    type: "",
  };

  const { user } = useContext(AppContext);

  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [alert, setAlert] = useState(initAlert);
  const [userList, setUserList] = useState([]);
  const [handleUser, setHandleUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    user?.role === "mod" && navigate("/atlas");
  }, [user]);

  useEffect(() => {
    handleGetUsersList();
  }, []);

  const openCreateUserModal = () => {
    setShowModalCreateUser(true);
  };

  const closeCreateUserModal = () => {
    setShowModalCreateUser(false);
  };

  const handleOpenDeleteModal = (user) => {
    setHandleUser(user);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const handleOpenEditModal = (user) => {
    setHandleUser(user);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleCreateUser = async (payload) => {
    const { url, method } = config.paths.createUser;
    setLoading(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: payload,
      });
      if (data.status === 200) {
        setLoading(false);
        message.success("Create new user successfully");
        closeCreateUserModal();
        handleGetUsersList();
      } else {
        setAlert({ message: data.message, type: "error" });
      }
    } catch (err) {
      setLoading(false);
      setAlert({ message: err.response.data.message, type: "error" });
    }
  };

  const handleDeleteUser = async () => {
    const { url, method } = config.paths.deleteUser;
    setLoading(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${handleUser.key}`,
        method,
      });
      if (data.status === 200) {
        setLoading(false);
        message.success("Delete user successfully");
        handleGetUsersList();
        handleCloseDeleteModal();
      }
    } catch (err) {
      setLoading(false);
      message.error(err.response.data.message);
    }
  };

  const handleEditUser = async (payload) => {
    const { url, method } = config.paths.editUser;
    setLoading(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${handleUser.key}`,
        method,
        data: payload,
      });
      if (data.status === 200) {
        setLoading(false);
        message.success("Edit user successfully");
        handleCloseEditModal();
        handleGetUsersList();
      }
    } catch (err) {
      setLoading(false);
      message.error(err.response.data.message);
    }
  };

  const handleGetUsersList = async () => {
    const { url, method } = config.paths.getUsers;
    setLoading(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        params: { page: 1, perPage: 100 },
      });
      if (data.status === 200) {
        setLoading(false);
        setUserList(data.data);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <DashboardContent
      title="User"
      prefix={
        <Button onClick={openCreateUserModal} type="primary">
          Create
        </Button>
      }
    >
      {isLoading && <Loading />}
      <UserTable
        data={userList}
        openEditModal={handleOpenEditModal}
        openDeleteModal={handleOpenDeleteModal}
      />
      <DeleteUserModal
        onOk={handleDeleteUser}
        onCancel={handleCloseDeleteModal}
        visible={openDeleteModal}
      />
      {showModalCreateUser && (
        <ModalCreateUser
          alert={alert}
          onSubmit={handleCreateUser}
          isVisible={showModalCreateUser}
          onCancel={closeCreateUserModal}
        />
      )}
      {openEditModal && (
        <ModalEditUser
          onSubmit={handleEditUser}
          initValue={handleUser}
          visible={openEditModal}
          alert={alert}
          onCancel={handleCloseEditModal}
        />
      )}
    </DashboardContent>
  );
};

export default User;
