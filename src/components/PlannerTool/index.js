import { Physics } from "@react-three/cannon";
import { Html, OrbitControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import ActionMenu from "./ActionMenu";
import AssetMenu from "./AssetMenu";
import Ground from "./Ground";
import Model from "./Model";
import { CloseOutlined } from "@ant-design/icons";
import Crosshair from "./Crosshair";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import { useEffect } from "react";
import Player from "./Player";
import usePrompt from "../../hooks/usePrompt";
import { Suspense } from "react";
import AssetSpinner from "../AssetSpinner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateUUID } from "three/src/math/MathUtils";
import { hashUrl } from "../../helpers";
import { useRef } from "react";
import { message } from "antd";
import CanvasAction from "./CanvasAction";
import PolygonInfo from "./PolygonInfo";

const CityPlannerTool = ({
  setIsAddAsset,
  modelPayload,
  handleSaveWorld,
  deleteAsset,
  assets,
  groundAssets,
  setIsLoad,
  updateLinkZip,
}) => {
  const controlRef = useRef();

  const [models, setModels] = useState([]);
  const [ground, setGround] = useState();
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentModel, setCurrentModel] = useState();
  const [isPreview, setIsPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMapGrid, setShowMapGrid] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [groundArgs, setGroundArgs] = useState([16, 16]);
  const [transformMode, setTransformMode] = useState("translate");
  const [currentAsset, setCurrentAsset] = useState("");

  const sumModelsTriangle =
    models.reduce((total, model) => total + model.info.triangles, 0) +
      ground?.info?.triangles || 0;

  useEffect(() => {
    if (modelPayload) {
      setModels(modelPayload.models);
      setGround(modelPayload.playground);
    }
  }, [modelPayload]);

  useEffect(() => {
    window.addEventListener("beforeunload", confirmReload);
    return () => window.removeEventListener("beforeunload", confirmReload);
  }, []);

  const confirmReload = (e) => {
    if (!isSaved) {
      e.preventDefault();
      e.return = "";
    }
  };

  const setNotSave = () => {
    setIsSaved(false);
  };

  const changeTransformMode = (mode) => {
    if (transformMode === mode) {
      setTransformMode("translate");
    } else {
      setTransformMode(mode);
    }
  };

  usePrompt("Your work is not saved", !isSaved);

  const toggleMapGrid = () => setShowMapGrid(!showMapGrid);
  const togglePreview = () => setIsPreview(!isPreview);
  const addModel = (x, y, z) => {
    const findAsset = assets.find((asset) => asset._id === currentAsset);
    setModels([
      ...models,
      {
        pos: [x, y, z],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        key: generateUUID(),
        texture: findAsset?.file,
        info: findAsset?.info,
        assetId: currentAsset,
      },
    ]);
    setNotSave();
  };

  const changeGround = (groundObj) => {
    setGround(groundObj);
    setNotSave();
  };

  const removeModel = () => {
    const filteredModel = models.filter((model) => model.key !== currentModel);
    setModels(filteredModel);
    setCurrentModel(null);
    setNotSave();
  };

  const generateBuilderFile = async () => {
    const version = 10;
    const project = { layout: { rows: 1, cols: 1 } };
    const scene = {};
    const entities = {};
    const components = {};
    const builderAssets = {};

    //add ground
    const splitGroundThumb = ground.thumbnail.split("/");
    const groundId = splitGroundThumb[splitGroundThumb.length - 2];
    const shapeId = generateUUID();
    const transformId = generateUUID();
    const entityId = generateUUID();
    builderAssets[groundId] = {
      id: groundId,
      name: ground.name,
      model: ground.file.split("/").pop(),
      script: null,
      tags: ["ground"],
      category: "ground",
      thumbnail: ground.thumbnail,
      contents: {
        [ground.file.split("/").pop()]: await hashUrl(ground.file),
        [ground.items.map((groundItem) => groundItem.split("/").pop())[0]]:
          await hashUrl(ground.items[0]),
        [ground.thumbnail.split("/").pop()]: await hashUrl(ground.thumbnail),
      },
    };
    components[shapeId] = {
      id: shapeId,
      type: "GLTFShape",
      data: { assetId: groundId },
    };
    components[transformId] = {
      id: transformId,
      type: "Transform",
      data: {
        position: { x: 8, y: 0, z: 8 },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
          w: 1,
        },
        scale: { x: 1, y: 1, z: 1 },
      },
    };
    entities[entityId] = {
      id: entityId,
      components: [shapeId, transformId],
      disableGizmos: true,
      name: "entity",
    };

    // add model
    for (const model of models) {
      const entityId = generateUUID();
      const shapeId = generateUUID();
      const transformId = generateUUID();
      scene["id"] = generateUUID();
      const findAsset = assets.find((asset) => asset._id === model.assetId);

      builderAssets[model.assetId] = {
        id: model.assetId,
        name: model.texture.split("/").pop().replace(".glb", ""),
        model: model.texture.split("/").pop(),
        script: null,
        tags: [],
        category: "decorations",
        thumbnail: assets.find((asset) => asset.file === model.assetId)
          ?.thumbnail,
        contents: {
          [model.texture.split("/").pop()]: await hashUrl(model.texture),
        },
      };

      // assign texture to contents field of asset
      findAsset?.items.map(async (assetItem) =>
        Object.assign(builderAssets[model.assetId].contents, {
          [assetItem.split("/").pop()]: await hashUrl(assetItem),
        })
      );
      components[shapeId] = {
        id: shapeId,
        type: "GLTFShape",
        data: { assetId: model.assetId },
      };
      components[transformId] = {
        id: transformId,
        type: "Transform",
        data: {
          position: {
            x: model.pos[0] + 8,
            y: model.pos[1],
            z: model.pos[2] + 8,
          },
          rotation: {
            x: model.rotation[0],
            y: model.rotation[1],
            z: model.rotation[2],
            w: model.rotation[3],
          },
          scale: { x: model.scale[0], y: model.scale[1], z: model.scale[2] },
        },
      };
      entities[entityId] = {
        id: entityId,
        components: [shapeId, transformId],
        name: model.texture.split("/").pop().replace(".glb", ""),
      };
    }
    const jsonBuilder = JSON.stringify({
      version,
      project,
      scene: { entities, components, assets: builderAssets },
    });

    const blob = new Blob([jsonBuilder], {
      type: "text/plain;charset=utf-8",
    });
    return blob;
  };

  const generateZipFile = () => {
    const zip = new JSZip();

    // Handle zip builder file
    zip.file("builder.json", generateBuilderFile());

    // Handle fetch all assets
    const arrOfFiles = models.map((model) => {
      const findAsset = assets.find((asset) => asset._id === model.assetId);

      fetch(model.texture).then((res) => {
        zip.file(
          `${model.assetId}/${model.texture.split("/").pop()}`,
          res.blob()
        );
      });

      findAsset?.items.map((assetItem) =>
        fetch(assetItem).then((res) => {
          zip.file(
            `${model.assetId}/${assetItem.split("/").pop()}`,
            res.blob()
          );
        })
      );
    });

    // Handle fetch ground asset
    const splitGroundThumb = ground.thumbnail.split("/");
    const groundId = splitGroundThumb[splitGroundThumb.length - 2];
    const groundFileGLB = fetch(ground.file).then((res) => {
      zip.file(`${groundId}/${ground.file.split("/").pop()}`, res.blob());
    });
    const groundFileImg = ground.items.map((groundItem) =>
      fetch(groundItem).then((res) => {
        zip.file(`${groundId}/${groundItem.split("/").pop()}`, res.blob());
      })
    );
    const groundThumbnail = fetch(ground.thumbnail, {
      mode: "cors",
      cache: "no-cache",
    }).then((res) => {
      zip.file(`${groundId}/${ground.thumbnail.split("/").pop()}`, res.blob());
    });
    // Download as zip file
    return Promise.all([
      ...arrOfFiles,
      groundFileGLB,
      ...groundFileImg,
      groundThumbnail,
    ])
      .then(() => {
        return zip.generateAsync({ type: "blob" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleExport = async () => {
    setIsLoad(true);
    setCurrentAsset("");
    try {
      saveAs(
        await generateZipFile(),
        `${modelPayload?.name.replace(" ", "-")}.zip`
      );
      setIsLoad(false);
    } catch (e) {
      setIsLoad(false);
    }
  };

  const resetScene = () => {
    setIsSaved(false);
    setModels([]);
  };

  const saveWorld = async () => {
    // Validate polygons of scene
    if (sumModelsTriangle > 10000)
      return message.error("Scene size is too big, try to remove some model");
    const blob = await generateZipFile();
    const zipFile = new File(
      [blob],
      `${modelPayload?.name.replace(" ", "-")}.zip`
    );
    //fetch api save world
    handleSaveWorld(models, ground);
    // upload zip to api to read
    updateLinkZip(zipFile);
    // remove chose asset
    setCurrentAsset("");
    setIsSaved(true);
  };

  const renderModels = () => {
    return models.map((model) => (
      <Suspense
        key={model.key}
        fallback={
          <Html pretend center>
            <AssetSpinner />
          </Html>
        }
      >
        <Model
          setNotSave={setNotSave}
          setModels={setModels}
          currentAsset={currentAsset}
          transformMode={transformMode}
          setTransformMode={setTransformMode}
          modelId={model.key}
          models={models}
          setIsDragging={setIsDragging}
          setCurrentModel={setCurrentModel}
          meshTexture={model.texture}
          rotation={model.rotation}
          scale={model.scale}
          position={model.pos}
        />
      </Suspense>
    ));
  };

  return (
    <div>
      {!isPreview && (
        <ActionMenu
          isSaved={isSaved}
          changeTransformMode={changeTransformMode}
          modelPayload={modelPayload}
          saveWorld={saveWorld}
          togglePreview={togglePreview}
          toggleSidebar={() => setShowSidebar(!showSidebar)}
          toggleMapGrid={toggleMapGrid}
          currentModel={currentModel}
          removeModel={removeModel}
          handleExport={handleExport}
        />
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row-reverse",
          height: isPreview ? "100vh" : "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        {showSidebar && !isPreview && (
          <AssetMenu
            controlRef={controlRef}
            currentAsset={currentAsset}
            setCurrentAsset={setCurrentAsset}
            assets={assets}
            changeGround={changeGround}
            groundAssets={groundAssets}
            deleteAsset={deleteAsset}
            setIsAddAsset={setIsAddAsset}
            addModel={addModel}
          />
        )}

        {isPreview && <Crosshair />}
        {isPreview && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsPreview(false);
            }}
            style={{
              position: "fixed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              top: 40,
              right: 40,
              borderRadius: "50%",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.7)",
              width: 50,
              height: 50,
              zIndex: 2000,
              cursor: "pointer",
            }}
          >
            <CloseOutlined />
          </div>
        )}
        <Canvas
          shadows
          camera={{ position: [25, 25, 25] }}
          style={{
            position: "relative",
            backgroundColor: "#212121",
          }}
          frameloop="demand"
        >
          {isPreview && (
            <>
              <Sky sunPosition={[100, 85, 100]} />
              <pointLight
                color={0xffffff}
                castShadow
                intensity={0.5}
                position={[20, 25, 20]}
              />
            </>
          )}
          {!isPreview && (
            <OrbitControls
              ref={controlRef}
              enabled={!isDragging}
              maxPolarAngle={Math.PI / 2.2}
            />
          )}
          <ambientLight color={0xffffff} intensity={0.5} />
          <directionalLight
            color={0xffffff}
            intensity={1}
            position={[5, 5, 5]}
          />
          <Physics gravity={[0, -30, 0]}>
            <Player isPreview={isPreview} position={[0, 3, 0]} />
            <Selection>
              <EffectComposer multisampling={8} autoClear={false}>
                <Outline
                  blur
                  visibleEdgeColor="yellow"
                  edgeStrength={10}
                  width={2200}
                />
              </EffectComposer>
              {renderModels()}
            </Selection>
            <Ground
              currentAsset={currentAsset}
              setCurrentAsset={setCurrentAsset}
              addModel={addModel}
              controlRef={controlRef}
              showMapGrid={showMapGrid}
              texture={ground?.items?.find((item) => item.includes(".png"))}
              position={[0, 0, 0]}
              groundArgs={groundArgs}
            />
          </Physics>
        </Canvas>
        {!isPreview && <CanvasAction resetScene={resetScene} />}
        {!isPreview && <PolygonInfo polygonSum={sumModelsTriangle} />}
      </div>
    </div>
  );
};

export default CityPlannerTool;
