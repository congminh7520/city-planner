import { Button, message, Modal, Typography } from "antd";
import { useContext, useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import config from "../../config";
import AppContext from "../../context/AppContext";

const PreviewAtlasModal = ({
  requestAtlasPayload,
  setOpenRequestModal,
  onConsider,
  ...props
}) => {
  const { user } = useContext(AppContext);
  const [isPreviewMapLoaded, setIsPreviewMapLoaded] = useState(true);
  const [isCurrentMapLoaded, setIsCurrentMapLoaded] = useState(true);

  return (
    <Modal
      width={1000}
      title={`Preview atlas ${
        requestAtlasPayload?.title ? requestAtlasPayload?.title : ""
      }`}
      {...props}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div className="request-atlas" style={{ width: 1000 }}>
          <Typography.Title level={5}>Preview atlas</Typography.Title>
          <div style={{ position: "relative", minHeight: 472 }}>
            <MapInteractionCSS>
              <img
                style={{ width: "100%", height: "100%" }}
                src={
                  requestAtlasPayload.image
                    ? requestAtlasPayload.image
                    : `${config.app.mapHost}?size=0&width=5012&height=5012&isPreview=1&x1=${requestAtlasPayload?.x1}&x2=${requestAtlasPayload?.x2}&y1=${requestAtlasPayload?.y1}&y2=${requestAtlasPayload?.y2}&type=${requestAtlasPayload?.type}`
                }
                alt="atlas"
                onError={() => {
                  message.error("This position already has owner");
                  setOpenRequestModal(false);
                }}
                onLoad={() => {
                  setIsPreviewMapLoaded(false);
                }}
              />
            </MapInteractionCSS>
            {isPreviewMapLoaded && (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  fontSize: "24px",
                }}
              >
                Loading...
              </div>
            )}
          </div>
        </div>
        <div
          className="current-atlas"
          style={{ width: 1000, position: "relative" }}
        >
          <Typography.Title level={5}>Current atlas</Typography.Title>
          <div style={{ position: "relative", minHeight: 472 }}>
            <MapInteractionCSS>
              <img
                style={{ width: "100%", height: "100%" }}
                src={`${
                  config.app.currentMapHost
                }?mapChange=${new Date().getTime()}`}
                alt="atlas"
                onLoad={() => {
                  setIsCurrentMapLoaded(false);
                }}
              />
            </MapInteractionCSS>
            {isCurrentMapLoaded && (
              <div
                style={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  fontSize: "24px",
                }}
              >
                Loading...
              </div>
            )}
          </div>
        </div>
      </div>
      {user?.role === "admin" && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => onConsider("approve", requestAtlasPayload.key)}
            style={{ marginRight: "8px" }}
            type="primary"
          >
            Approve
          </Button>
          <Button onClick={() => onConsider("reject", requestAtlasPayload.key)}>
            Reject
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default PreviewAtlasModal;
