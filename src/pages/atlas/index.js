import { DashboardContent } from "../../layout";
import AtlasForm from "../../components/AtlasForm";
import { MapInteractionCSS } from "react-map-interaction";
import styles from "./atlas.module.css";
import config from "../../config";
import axios from "axios";
import { message } from "antd";
import { EditOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import AtlasPreviousVersion from "../../components/AtlasPreviousVersion";
import Loading from "../../components/Loading";
import PreviewAtlasModal from "../../components/PreviewAtlasModal";
import AtlasCanvas from "../../components/AtlasCanvas";
import CheckCoordsConfirmModal from "../../components/CheckCoordsConfirmModal";
const Atlas = () => {
  const { user } = useContext(AppContext);
  const [currentMap, setCurrentMap] = useState("");
  const [previousMapData, setPreviousMapData] = useState([]);
  const [isLoad, setIsLoad] = useState(false);
  const [imgLoad, setImgLoad] = useState(true);
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [atlasPayload, setAtlasPayload] = useState();
  const [currentType, setCurrentType] = useState("");
  const [typesData, setTypesData] = useState([]);
  const [atlasData, setAtlasData] = useState();
  const [updateMap, setUpdateMap] = useState(new Date().getTime());
  const [modalConfirm, setModalConfirm] = useState(false);
  const [disableTranslate, setDisableTranslate] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentAtlasPositionColor, setCurrentAtlasPositionColor] =
    useState("#47e60f");

  useEffect(() => {
    handleGetMapHistories();
    handleGetTypes();
  }, []);

  const handleUpdateMap = () => setUpdateMap(new Date().getTime());

  const editAtlasMap = async (payload) => {
    const { url, method } = config.paths.editAtlas;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: payload,
      });
      setIsLoad(false);
      if (data.status === 200) {
        message.success(data.message);
        handleGetMapHistories();
        setImgLoad(true);
        handleUpdateMap();
      } else {
        message.error("This position is owned");
      }
    } catch (err) {
      setIsLoad(false);
      message.error(err.response.data.message);
    }
  };

  const handleGetTypes = async () => {
    const { url, method } = config.paths.getAtlasItemTypes;
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
      });
      setTypesData(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const revertMap = async (atlasHistoryId) => {
    const { url, method } = config.paths.revertAtlasMap;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: { atlasHistoryId },
      });
      setIsLoad(false);
      if (data.status === 200) {
        message.success(data.message);
        handleGetMapHistories();
        setCurrentMap("");
        setImgLoad(true);
        handleUpdateMap();
      } else {
        message.error(data.message);
      }
    } catch (err) {
      setIsLoad(false);
      message.error(err.response.data.message);
    }
  };

  const revertAllMap = async () => {
    const { url, method } = config.paths.revertAllAtlasMap;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
      });
      setIsLoad(false);
      if (data.status === 200) {
        message.success(data.message);
        handleGetMapHistories();
        setCurrentMap("");
        setImgLoad(true);
        handleUpdateMap();
      } else {
        message.error(data.message);
      }
    } catch (err) {
      setIsLoad(false);
      message.error(err.response.data.message);
    }
  };

  const handleGetMapHistories = async () => {
    const { url, method } = config.paths.getAtlasHistories;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
      });
      setIsLoad(false);
      setPreviousMapData(data.data);
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const handleChoosePrevioustMap = (map) => {
    setImgLoad(true);
    setCurrentMap(map);
  };

  const handleChooseCurrentMap = () => {
    setImgLoad(true);
    setCurrentMap("");
  };

  const openConfirmEditAtlasModal = (payload) => {
    setOpenRequestModal(true);
    setAtlasPayload(payload);
  };

  const closeConfirmEditAtlasModal = () => {
    setOpenRequestModal(false);
  };

  const handleSendEditMapRequest = async () => {
    const { url, method } = config.paths.createRequestEditMap;
    setIsLoad(true);
    const _payload = {
      ...atlasPayload,
      coords: {
        x1: parseInt(atlasPayload?.x1),
        y1: parseInt(atlasPayload?.y1),
        x2: parseInt(atlasPayload?.x2),
        y2: parseInt(atlasPayload?.y2),
      },
    };
    delete _payload.x1;
    delete _payload.x2;
    delete _payload.y1;
    delete _payload.y2;
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: _payload,
      });
      if (data.status === 200) {
        setIsLoad(false);
        message.success("Your edit is submitted to admin");
        closeConfirmEditAtlasModal();
        handleUpdateMap();
      }
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const checkCoords = async (payload) => {
    const { url, method } = config.paths.checkCoords;
    setIsLoad(true);
    try {
      const { x1, x2, y1, y2 } = payload;
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        params: { x1, x2, y1, y2 },
      });
      setIsLoad(false);
      if (data.haveTilesHasOwner) {
        setAtlasPayload(payload);
        return setModalConfirm(true);
      }
      user?.role === "admin"
        ? editAtlasMap(payload)
        : openConfirmEditAtlasModal(payload);
    } catch (err) {
      setIsLoad(false);
      console.error(err);
    }
  };

  const renderAtlasMap = () => {
    const previousAtlasMap = previousMapData.filter(
      (map) => map._id === currentMap
    );
    return (
      <div className={styles.atlasImage}>
        <div
          className={disableTranslate ? styles.atlasWrapperEdit : ""}
          style={{ position: "relative", width: 512, height: 512 }}
        >
          <MapInteractionCSS showControls disablePan={disableTranslate}>
            <AtlasCanvas
              width={512}
              height={512}
              atlasData={atlasData}
              setMousePosition={setMousePosition}
              setImgLoad={setImgLoad}
              updateMap={updateMap}
              currentMap={currentMap}
              previousMap={previousAtlasMap[0]?.image}
              setCurrentAtlasPositionColor={setCurrentAtlasPositionColor}
              disabledDraw={currentMap !== "" || !disableTranslate}
              setAtlasData={setAtlasData}
              currentType={typesData.find((type) => type._id === currentType)}
            />
          </MapInteractionCSS>
          <button
            onClick={() => setDisableTranslate(!disableTranslate)}
            style={{ position: "absolute", top: 90, right: 10 }}
          >
            {disableTranslate ? <FullscreenOutlined /> : <EditOutlined />}
          </button>
          <div
            style={{
              position: "absolute",
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "6px 16px",
              bottom: 0,
              right: 0,
            }}
          >
            {
              typesData.find(
                (type) => type.color.toLowerCase() == currentAtlasPositionColor
              )?.name
            }{" "}
            {`(${mousePosition?.x},${mousePosition?.y})`}
          </div>
          {imgLoad && (
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
        <AtlasPreviousVersion
          user={user}
          currentMap={currentMap}
          onRevertAll={revertAllMap}
          onRevert={revertMap}
          onChooseCurrentMap={handleChooseCurrentMap}
          onChoosePrevMap={handleChoosePrevioustMap}
          data={previousMapData}
        />
      </div>
    );
  };

  return (
    <DashboardContent title="Atlas">
      {isLoad && <Loading />}
      <div className={styles.container}>
        <AtlasForm
          values={[
            { name: ["x1"], value: atlasData?.x1 },
            { name: ["x2"], value: atlasData?.x2 },
            { name: ["y1"], value: atlasData?.y1 },
            { name: ["y2"], value: atlasData?.y2 },
          ]}
          atlasData={atlasData}
          disableTranslate={disableTranslate}
          setAtlasData={setAtlasData}
          typesData={typesData}
          onTypeChange={setCurrentType}
          user={user}
          onSubmit={checkCoords}
        />
        {renderAtlasMap()}
      </div>
      {openRequestModal && (
        <PreviewAtlasModal
          requestAtlasPayload={atlasPayload}
          setOpenRequestModal={setOpenRequestModal}
          onCancel={closeConfirmEditAtlasModal}
          visible={openRequestModal}
          onOk={handleSendEditMapRequest}
        />
      )}
      {modalConfirm && (
        <CheckCoordsConfirmModal
          title="Coords have owners"
          visible={modalConfirm}
          onCancel={() => setModalConfirm(false)}
          onOk={() => {
            user?.role === "admin"
              ? editAtlasMap(atlasPayload)
              : openConfirmEditAtlasModal(atlasPayload);
            setModalConfirm(false);
          }}
        />
      )}
    </DashboardContent>
  );
};

export default Atlas;
