import { Typography } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import config from "../../config";
import styles from "./styles.module.css";

const AtlasPreviousVersion = ({
  currentMap,
  onChooseCurrentMap,
  onChoosePrevMap,
  data,
  onRevertAll,
  onRevert,
  user,
}) => {
  return (
    <div style={{ marginTop: "16px" }}>
      <Typography.Title level={5}>Previous versions</Typography.Title>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflow: "auto",
        }}
      >
        <div
          onClick={currentMap !== "" ? onChooseCurrentMap : undefined}
          style={{
            width: "50px",
            height: "50px",
            cursor: "pointer",
            border: "1px solid",
            borderColor: currentMap === "" ? "#000" : "transparent",
            padding: "2px",
          }}
        >
          <img
            style={{ width: "100%" }}
            src={`${config.app.currentMapThumbnail}?${new Date().getTime()}`}
            alt="Atlas"
          />
        </div>
        <Typography.Title level={2}>|</Typography.Title>
        {data?.map((item) => (
          <div
            key={item._id}
            onClick={() =>
              item._id !== currentMap ? onChoosePrevMap(item._id) : undefined
            }
            className={styles.prevItem}
            style={{
              borderColor: currentMap === item._id ? "#000" : "transparent",
            }}
          >
            <img
              style={{ width: "100%" }}
              src={item.thumbnail}
              alt={item._id}
            />
            {user?.role === "admin" && (
              <div
                className={styles.prevItemRevert}
                title="Revert to this version"
                onClick={(e) => {
                  e.stopPropagation();
                  onRevert(item._id);
                }}
              >
                <RollbackOutlined />
              </div>
            )}
          </div>
        ))}
        {user?.role === "admin" && data.length > 0 && (
          <div
            onClick={onRevertAll}
            title="Revert all version"
            className={styles.revertAll}
          >
            <RollbackOutlined />
          </div>
        )}
      </div>
    </div>
  );
};

export default AtlasPreviousVersion;
