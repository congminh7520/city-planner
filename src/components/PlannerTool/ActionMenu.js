import { Button, Slider, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  FullscreenOutlined,
  RetweetOutlined,
  EyeOutlined,
  BorderlessTableOutlined,
  SaveOutlined,
  DoubleLeftOutlined,
  ExportOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const ActionMenu = ({
  removeModel,
  modelPayload,
  changeTransformMode,
  isSaved,
  saveWorld,
  currentModel,
  toggleMapGrid,
  togglePreview,
  toggleSidebar,
  handleExport,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#001529",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#29a0f6",
          fontSize: 20,
        }}
      >
        <Link to="/types">
          <DoubleLeftOutlined />
        </Link>
        <Typography.Title
          style={{ whiteSpace: "nowrap", color: "white", marginBottom: 0 }}
          level={4}
        >
          {modelPayload?.name}
        </Typography.Title>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          gap: 8,
        }}
      >
        <Tooltip placement="bottom" title="Remove">
          <Button disabled={!currentModel} onClick={removeModel}>
            <DeleteOutlined />
          </Button>
        </Tooltip>
        <div
          style={{
            position: "relative",
          }}
        >
          <Tooltip placement="bottom" title="Scale">
            <Button
              onClick={() => changeTransformMode("scale")}
              disabled={!currentModel}
            >
              <FullscreenOutlined />
            </Button>
          </Tooltip>
        </div>
        <div
          style={{
            position: "relative",
          }}
        >
          <Tooltip placement="bottom" title="Rotate">
            <Button
              onClick={() => changeTransformMode("rotate")}
              disabled={!currentModel}
            >
              <RetweetOutlined />
            </Button>
          </Tooltip>
        </div>
        <Tooltip placement="bottom" title="Map grid">
          <Button onClick={toggleMapGrid}>
            <BorderlessTableOutlined />
          </Button>
        </Tooltip>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Tooltip placement="bottom" title="Preview">
          <Button onClick={togglePreview} disabled={currentModel}>
            <EyeOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="bottom" title="Save map">
          <Button onClick={saveWorld} disabled={isSaved}>
            <SaveOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="bottom" title="Download">
          <Button onClick={handleExport}>
            <DownloadOutlined />
          </Button>
        </Tooltip>
        <Tooltip placement="bottom" title="Toggle sidebar">
          <Button onClick={toggleSidebar} disabled={currentModel}>
            <ExportOutlined />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ActionMenu;
