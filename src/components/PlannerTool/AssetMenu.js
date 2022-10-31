import { Tooltip, Typography } from "antd";
import { PlusSquareOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";

const AssetMenu = ({
  setIsAddAsset,
  deleteAsset,
  addModel,
  groundAssets,
  assets,
  controlRef,
  changeGround,
  currentAsset,
  setCurrentAsset,
}) => {
  const [hoverItem, setHoverItem] = useState("");

  const renderAssets = (assetType) => {
    return assetType?.map((asset) => {
      return (
        <Tooltip key={asset._id} placement="bottom" title={asset.name}>
          <div
            onPointerEnter={() => setHoverItem(asset._id)}
            onPointerLeave={() => setHoverItem("")}
            style={{
              position: "relative",
              width: 70,
              height: 70,
              cursor: "pointer",
              background:
                currentAsset === asset._id ? "#c5cc39" : "rgba(103,99,112,0.4)",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
                onClick={() =>
                  asset.type === "playground"
                    ? changeGround(asset)
                    : setCurrentAsset(
                        currentAsset === asset._id ? "" : asset._id
                      )
                }
                alt={asset.name}
                src={asset.thumbnail}
                name={asset.name}
                draggable={false}
              />
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                deleteAsset(asset._id, true);
              }}
              style={{
                position: "absolute",
                display: hoverItem === asset._id ? "flex" : "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                backgroundColor: "rgba(0,0,0,0.7)",
                width: 20,
                height: 20,
                borderRadius: "50%",
                top: -5,
                right: -5,
              }}
            >
              <CloseOutlined />
            </div>
          </div>
        </Tooltip>
      );
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#001529",
        padding: 20,
        width: 350,
        height: "100%",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "white",
          marginBottom: 16,
          fontSize: 20,
        }}
      >
        <Typography.Title
          style={{ color: "white", marginRight: 8, marginBottom: 0 }}
          level={3}
        >
          Assets
        </Typography.Title>
        <Tooltip placement="bottom" title="Add new asset">
          <div
            onClick={() => setIsAddAsset(true)}
            style={{ cursor: "pointer" }}
          >
            <PlusSquareOutlined />
          </div>
        </Tooltip>
      </div>
      <div style={{ userSelect: "none", marginBottom: 16 }}>
        <Typography.Title
          style={{ marginBottom: 12, color: "#bdbdbd" }}
          level={5}
        >
          Grounds
        </Typography.Title>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
            overflow: "auto",
            maxHeight: "100vh",
          }}
        >
          {renderAssets(groundAssets)}
        </div>
      </div>
      <div style={{ userSelect: "none" }}>
        <Typography.Title
          style={{ marginBottom: 12, color: "#bdbdbd" }}
          level={5}
        >
          Decorations
        </Typography.Title>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {renderAssets(assets)}
        </div>
      </div>
    </div>
  );
};

export default AssetMenu;
