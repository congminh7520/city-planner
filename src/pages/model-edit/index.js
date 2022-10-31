import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CityPlannerTool from "../../components/PlannerTool";
import config from "../../config";
import { getLocalStorage } from "../../helpers";
import Loading from "../../components/Loading";
import { message } from "antd";
import UploadAssetModal from "../../components/UploadAssetModal";

const ModelEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [modelPayload, setModelPayload] = useState();
  const [isLoad, setIsLoad] = useState(false);
  const [assets, setAssets] = useState([]);
  const [groundAssets, setGroundAssets] = useState([]);
  const [isAddAsset, setIsAddAsset] = useState(false);
  const [uploadModel, setUploadModel] = useState();

  useEffect(() => {
    fetchTypeDetail();
  }, [params.id]);

  useEffect(() => {
    !getLocalStorage("sid") && navigate("/");
    fetchAssets("model");
    fetchAssets("playground");
  }, []);

  const fetchTypeDetail = async () => {
    const { url, method } = config.paths.getAtlasItemTypes;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${params.id}`,
        method,
      });
      if (data.status === 200) {
        setModelPayload(data.data);
      } else {
        message.error(data.message);
      }
    } catch (e) {
      message.error(e.response.data.message);
    } finally {
      setIsLoad(false);
    }
  };

  const handleSaveWorld = async (models, playground) => {
    const { url, method } = config.paths.editAtlasItemType;
    setIsLoad(true);
    try {
      await axios({
        url: `${config.app.apiHost}${url}/${params.id}`,
        method,
        data: { models, playground },
      });
    } catch (e) {
      message.error(e.response.data.message);
    } finally {
      setIsLoad(false);
    }
  };

  const fetchAssets = async (type = "model") => {
    const { url, method } = config.paths.getModels;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}?type=${type}`,
        method,
      });
      if (data.status === 200) {
        type === "model" ? setAssets(data.data) : setGroundAssets(data.data);
      }
    } catch (e) {
      message.error(e.response.data.message);
    } finally {
      setIsLoad(false);
    }
  };

  const createModel = async (submitModelInfo) => {
    const { url, method } = config.paths.createModel;
    const modelFormData = new FormData();

    Object.keys(submitModelInfo).map((modelInfoKey) =>
      modelFormData.append(modelInfoKey, submitModelInfo[modelInfoKey])
    );
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: modelFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.status === 200) {
        setIsAddAsset(false);
        fetchAssets(submitModelInfo?.type);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoad(false);
    }
  };

  const updateLinkZip = async (zipFile) => {
    const { url, method } = config.paths.updateZip;
    const formData = new FormData();
    formData.append("zip", zipFile);
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${params.id}`,
        method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.status !== 200) {
        console.error(data);
      }
    } catch (e) {
      message.error(e.response.data.message);
    } finally {
      setIsLoad(false);
    }
  };

  const deleteAsset = async (modelId) => {
    const { url, method } = config.paths.deleteModel;
    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}/${modelId}`,
        method,
      });
      if (data.status === 200) {
        message.success("Asset removed");
        fetchAssets("model");
        fetchAssets("playground");
      }
    } catch (e) {
      message.error(e.response.data.message);
    } finally {
      setIsLoad(false);
    }
  };

  const uploadTemp = async (temp) => {
    const { url, method } = config.paths.uploadTemp;

    const modelFormData = new FormData();
    Object.keys(temp).map((modelInfoKey) =>
      modelFormData.append(modelInfoKey, temp[modelInfoKey])
    );

    setIsLoad(true);
    try {
      const { data } = await axios({
        url: `${config.app.apiHost}${url}`,
        method,
        data: modelFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.status === 200) {
        setUploadModel(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoad(false);
    }
  };

  return (
    <div style={{ overflow: "hidden", height: "100vh" }}>
      {isLoad && <Loading />}
      {isAddAsset && (
        <UploadAssetModal
          uploadTemp={uploadTemp}
          uploadModel={uploadModel}
          visible={isAddAsset}
          setUploadModel={setUploadModel}
          createModel={createModel}
          setIsLoad={setIsLoad}
          fetchAssets={fetchAssets}
          deleteAsset={deleteAsset}
          onCancel={() => {
            setIsAddAsset(false);
            setUploadModel(null);
          }}
        />
      )}
      <CityPlannerTool
        setIsLoad={setIsLoad}
        updateLinkZip={updateLinkZip}
        groundAssets={groundAssets}
        deleteAsset={deleteAsset}
        assets={assets}
        setIsAddAsset={setIsAddAsset}
        modelPayload={modelPayload}
        handleSaveWorld={handleSaveWorld}
      />
    </div>
  );
};

export default ModelEdit;
