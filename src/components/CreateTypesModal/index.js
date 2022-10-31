import { Modal, Alert } from "antd";
import TypesForm from "../TypesForm";

const CreateTypesModal = ({ onSubmit,isVisible, alert, ...props }) => {
  return (
    <Modal footer={null} title="Create types" visible={isVisible} {...props}>
      <div style={{marginBottom:'24px'}}>
        {alert?.message && <Alert message={alert.message} type={alert.type} />}
      </div>
      <TypesForm onSubmit={onSubmit} />
    </Modal>
  );
};

export default CreateTypesModal