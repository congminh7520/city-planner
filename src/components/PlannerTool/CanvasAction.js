import { RollbackOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const CanvasAction = ({ resetScene }) => {
  return (
    <div style={{ position: "absolute", bottom: 16, right: 310 }}>
      <Tooltip placement="top" title="Reset scene">
        <div onClick={resetScene} style={{ color: "white", cursor: "pointer" }}>
          <RollbackOutlined />
        </div>
      </Tooltip>
    </div>
  );
};

export default CanvasAction;
