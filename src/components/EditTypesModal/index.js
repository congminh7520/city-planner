import { Modal, Alert } from "antd";
import TypesForm from "../TypesForm";

const EditTypesModal = ({
  onSubmit,
  isVisible,
  alert,
  initValues,
  ...props
}) => {
  return (
    <Modal footer={null} title="Edit types" visible={isVisible} {...props}>
      <div style={{ marginBottom: "24px" }}>
        {alert?.message && <Alert message={alert.message} type={alert.type} />}
      </div>
      <TypesForm isEdit initialValues={initValues} onSubmit={onSubmit} />
    </Modal>
  );
};

export default EditTypesModal;
