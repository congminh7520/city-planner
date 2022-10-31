import { message, Modal } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import JSZip from "jszip";
import { useState } from "react";
import PreviewCanvas from "./Canvas";
import { useEffect } from "react";

const UploadAssetModal = ({
  setIsLoad,
  fetchAssets,
  createModel,
  uploadModel,
  setUploadModel,
  uploadTemp,
  ...props
}) => {
  const [modelTextures, setModelTextures] = useState({});
  const [meshInfo, setMeshInfo] = useState();

  const draggerProps = {
    name: "file",
    onDrop(e) {
      if (
        !e.dataTransfer.files[0].name.includes(".zip") &
        !e.dataTransfer.files[0].name.includes(".glb")
      )
        return message.error("Wrong file format!");
      handleChangeFile(e.dataTransfer.files);
    },
  };

  useEffect(() => {
    if (uploadModel) {
      setModelTextures((prevModel) => ({
        ...prevModel,
        file: uploadModel.file,
        name: uploadModel.file
          .split("/")
          .pop()
          .replace(uploadModel.file.includes(".glb") ? ".glb" : ".gltf", ""),
        items: uploadModel.items[0],
        type: "model",
      }));
    }
  }, [uploadModel]);

  const handleChangeFile = (files) => {
    if (files[0]) {
      if (files[0].size >= 10820000) {
        return message.error("File must less than 10mb");
      }
      if (files[0].type === "application/x-zip-compressed") {
        const zip = new JSZip();
        zip.loadAsync(files[0]).then(async (zipArchive) => {
          let zipValues = Object.values(zipArchive.files);
          const fileList = {};
          for (let i = 0; i < zipValues.length; i++) {
            if (!zipValues[i].dir) {
              const compressedFile = zipArchive.file(zipValues[i].name);
              const uint8array = await compressedFile.async("uint8array");
              const file = new File([uint8array], zipValues[i].name);
              if (file.name.includes(".glb") || file.name.includes(".gltf")) {
                Object.assign(fileList, {
                  file,
                  name: (Math.random() + 1).toString(36).substring(7),
                });
              } else if (!file.name.includes("thumbnail")) {
                Object.assign(fileList, { items: file });
              }
            }
          }
          uploadTemp(fileList);
        });
      } else {
        const fileList = {
          file: files[0],
          name: (Math.random() + 1).toString(36).substring(7),
          items: [],
        };
        uploadTemp(fileList);
      }
    }
  };

  const handleSetFormSubmit = (obj) => {
    setModelTextures({ ...modelTextures, ...obj });
  };

  const convertUrlToFile = (url) =>
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => new File([blob], url?.split("/").pop()));

  return (
    <Modal
      onOk={async () => {
        meshInfo?.triangles <= 10000
          ? createModel({
              ...modelTextures,
              file: await convertUrlToFile(modelTextures.file),
              items: await convertUrlToFile(modelTextures.items),
              ...meshInfo,
            })
          : message.error("Model info invalid, please try another one");
        setUploadModel();
      }}
      title="Add new asset"
      {...props}
    >
      <div
        style={{
          margin: "0 auto 12px auto",
        }}
      >
        <div
          style={{
            marginBottom: 16,
          }}
        >
          {modelTextures?.file ? (
            <PreviewCanvas
              handleSetFormSubmit={handleSetFormSubmit}
              modelTextures={modelTextures}
              meshInfo={meshInfo}
              setMeshInfo={setMeshInfo}
            />
          ) : (
            <Dragger showUploadList={false} {...draggerProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Drag glb or zip file to this area to upload
              </p>
            </Dragger>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UploadAssetModal;
