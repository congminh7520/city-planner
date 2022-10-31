import { Modal } from "antd";

const DeleteUserModal = ({ ...props }) => {
  return (
    <Modal title="Delete confirm" {...props}>
      Are you sure want to delete this user?
    </Modal>
  );
};

export default DeleteUserModal;
