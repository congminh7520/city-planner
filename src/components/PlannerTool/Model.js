import { useRef, useState } from "react";
import { Select } from "@react-three/postprocessing";
import { useEffect } from "react";
import { TransformControls, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { useThree } from "@react-three/fiber";

const Model = ({
  position,
  setNotSave,
  meshTexture,
  setCurrentModel,
  setIsDragging,
  rotation,
  scale,
  modelId,
  models,
  setModels,
  currentAsset,
  transformMode,
  setTransformMode,
}) => {
  const { scene } = useGLTF(meshTexture);
  const ref = useRef();
  const cloneScene = useMemo(() => clone(scene), [scene]);
  const { camera, gl } = useThree();
  const transformRef = useRef();

  const [pos, setPos] = useState(position ? position : [0, 0, 0]);
  const [axesHelper, setAxesHelper] = useState(false);
  const [modelScale, setModelScale] = useState(scale);
  const [modelRotate, setModelRotate] = useState(rotation);

  useMemo(() => {
    cloneScene.traverse((sceneNode) => {
      if (sceneNode.isMesh) {
        // show shadow for model
        sceneNode.castShadow = true;
        sceneNode.receiveShadow = true;
        // remove collider around model
        if (sceneNode.name.includes("_collider"))
          return (sceneNode.visible = false);
      }
    });
  }, [cloneScene]);

  useEffect(() => {
    models.map((model) => {
      if (model.key === modelId) {
        model.pos = pos;
        model.rotation = modelRotate;
        model.scale = modelScale;
      }
    });
    setModels(models);
  }, [pos, modelScale, modelRotate]);

  useEffect(() => {
    transformRef.current.detach();
  }, []);

  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;
      const onChangeDrag = (event) => {
        setIsDragging(event.value);
        setNotSave();
      };
      transformRef.current.visible = axesHelper;
      controls.addEventListener("dragging-changed", onChangeDrag);
      return () =>
        controls.removeEventListener("dragging-changed", onChangeDrag);
    }
  });

  useEffect(() => {
    if (transformRef.current) {
      const controls = transformRef.current;
      const onDrag = () => {
        const {
          x: rotateX,
          y: rotateY,
          z: rotateZ,
          w: rotateW,
        } = controls.worldQuaternion;
        const { x: scaleX, y: scaleY, z: scaleZ } = controls.worldScale;
        const {
          x: positionX,
          y: positionY,
          z: positionZ,
        } = controls.worldPosition;
        setModelRotate([rotateX, rotateY, rotateZ, rotateW]);
        setModelScale([scaleX, scaleY, scaleZ]);
        setPos([positionX, positionY, positionZ]);
      };
      controls.addEventListener("objectChange", onDrag);
      return () => controls.removeEventListener("objectChange", onDrag);
    }
  });

  return cloneScene ? (
    <>
      <Select enabled={axesHelper}>
        <primitive
          ref={ref}
          position={position}
          quaternion={rotation}
          scale={scale}
          onClick={() => {
            if (!currentAsset) {
              setAxesHelper(true);
              setCurrentModel(modelId);
              transformRef.current.attach(cloneScene);
            }
          }}
          onPointerMissed={() => {
            setAxesHelper(false);
            setCurrentModel(null);
            setTransformMode("translate");
          }}
          dispose={null}
          object={cloneScene}
        />
      </Select>
      <TransformControls
        mode={transformMode}
        size={0.5}
        translationSnap={1}
        ref={transformRef}
        rotationSnap={0.2}
        args={[camera, gl.domElement]}
      />
    </>
  ) : null;
};

export default Model;
