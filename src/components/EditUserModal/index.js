import { Alert, Modal } from "antd";
import RegisterForm from "../RegisterForm";
import styles from "./modal.module.css";

const ModalEditUser = ({ initValue,onSubmit, isEdit, alert, ...props }) => {
  return (
    <Modal footer={null} title="Edit user" {...props}>
      <div className={styles.alert}>
        {alert?.message && <Alert message={alert.message} type={alert.type} />}
      </div>
      <RegisterForm isEdit initialValues={initValue} onSubmit={onSubmit} />
    </Modal>
  );
};

export default ModalEditUser;
