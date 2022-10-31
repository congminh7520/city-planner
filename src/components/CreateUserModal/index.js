import { Alert, Modal } from "antd";
import RegisterForm from "../RegisterForm";
import styles from "./modal.module.css";

const ModalCreateUser = ({ isVisible, onSubmit, alert, ...props }) => {
  return (
    <Modal footer={null} title="Create user" visible={isVisible} {...props}>
      <div className={styles.alert}>
        {alert?.message && <Alert message={alert.message} type={alert.type} />}
      </div>
      <RegisterForm isCreate onSubmit={onSubmit} />
    </Modal>
  );
};

export default ModalCreateUser;
