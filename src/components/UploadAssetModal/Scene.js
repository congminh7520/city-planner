import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const ThumbnailScene = ({
  modelTextures,
  camChange,
  handleSetFormSubmit,
  controlRef,
  setMeshInfo,
}) => {
  const { camera } = useThree();
  const gl = useThree((state) => state.gl);
  const ref = useRef();
  const gltfFile = modelTextures.file;
  const { scene } = useGLTF(gltfFile);
  scene.traverse((sceneNode) => {
    if (sceneNode.isMesh) {
      if (sceneNode.name.includes("_collider"))
        return (sceneNode.visible = false);
    }
  });

  useEffect(() => {
    setMeshInfo({
      triangles: gl.info.render.triangles,
      textures: gl.info.memory.textures,
      materials: gl.info.memory.geometries,
    });
  },[gl.info.render.triangles]);

  // Handle adjust camera to fit with object
  useEffect(() => {
    if (ref.current) {
      const bbox = new THREE.Box3().setFromObject(ref.current);
      const sphere = bbox.getBoundingSphere(new THREE.Sphere());
      const { center, radius } = sphere;
      controlRef.current.reset();
      controlRef.current.target.copy(center);
      controlRef.current.maxDistance = 5 * radius;

      camera.position.copy(
        center
          .clone()
          .add(new THREE.Vector3(1 * radius, 0.75 * radius, 1.2 * radius))
      );
      camera.far = 10 * radius;
      camera.updateProjectionMatrix();
      setTimeout(() => {
        handleSetThumbnail();
      }, 500);
    }
  }, []);

  useEffect(() => {
    handleSetThumbnail();
  }, [camChange]);

  const handleSetThumbnail = () => {
    gl.domElement.toBlob((blob) => {
      const thumbnail = new File([blob], `${modelTextures.name}.png`);
      handleSetFormSubmit({ thumbnail });
    });
  };

  return (
    <>
      <primitive ref={ref} object={scene} />
    </>
  );
};

export default ThumbnailScene;
