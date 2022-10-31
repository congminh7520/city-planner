import { Modal } from "antd";

const DeleteTypesModal = ({ ...props }) => {
  return (
    <Modal title="Delete confirm" {...props}>
      Are you sure want to delete this type?
    </Modal>
  );
};

export default DeleteTypesModal;
