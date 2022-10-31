import ThumbnailScene from "./Scene";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import AssetSpinner from "../AssetSpinner";
import { useState } from "react";
import { Form, Input, Select, Typography } from "antd";

const { Option } = Select;

const PreviewCanvas = ({
  modelTextures,
  handleSetFormSubmit,
  meshInfo,
  setMeshInfo,
}) => {
  const controlRef = useRef();
  const [camChange, setCamChange] = useState(1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          marginRight: 16,
        }}
      >
        <Canvas
          style={{
            width: 150,
            height: 150,
            marginBottom: 8,
            boxShadow: "0 0 3px 0 #000",
            borderRadius: 8,
          }}
          frameloop="demand"
          onPointerLeave={() => setCamChange(camChange + 1)}
          gl={{ preserveDrawingBuffer: true }}
        >
          <OrbitControls ref={controlRef} />
          <ambientLight color={0xffffff} intensity={1} />
          <directionalLight
            color={0xffffff}
            intensity={0.8}
            position={[2, 2, 2]}
          />
          <rectAreaLight
            color={0xffffff}
            intensity={0.5}
            width={40}
            height={40}
            position={[-3, 0, 0]}
          />
          <Suspense
            fallback={
              <Html center prepend distanceFactor={10} zIndexRange={[100, 0]}>
                <AssetSpinner />
              </Html>
            }
          >
            <ThumbnailScene
              setMeshInfo={setMeshInfo}
              camChange={camChange}
              handleSetFormSubmit={handleSetFormSubmit}
              modelTextures={modelTextures}
              controlRef={controlRef}
            />
          </Suspense>
        </Canvas>
        <div>
          <Typography.Text
            style={{
              display: "block",
              color: meshInfo?.triangles > 10000 ? "red" : "#000000",
            }}
          >
            Triangles: {meshInfo?.triangles ? meshInfo?.triangles : 0}
          </Typography.Text>
          <Typography.Text
            style={{
              display: "block",
            }}
          >
            Textures: {meshInfo?.textures ? meshInfo?.textures : 0}
          </Typography.Text>
          <Typography.Text
            style={{
              display: "block",
            }}
          >
            Materials: {meshInfo?.materials ? meshInfo?.materials : 0}
          </Typography.Text>
        </div>
      </div>
      <div>
        <Form.Item label="Asset name">
          <Input
            onChange={(e) => handleSetFormSubmit({ name: e.target.value })}
            defaultValue={modelTextures.name}
            placeholder="Enter model name"
          />
        </Form.Item>
        <Form.Item label="Asset type">
          <Select
            onChange={(value) => handleSetFormSubmit({ type: value })}
            defaultValue="model"
            placeholder="Select type of model"
          >
            <Option value="model">Model</Option>
            <Option value="playground">Ground</Option>
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default PreviewCanvas;
