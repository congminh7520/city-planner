import { Modal, Typography } from "antd";

const CheckCoordsConfirmModal = ({ ...props }) => {
  return (
    <Modal {...props}>
      <Typography.Text>
        Some tiles in the position has owner. Do you want to continue?
      </Typography.Text>
    </Modal>
  );
};

export default CheckCoordsConfirmModal;
