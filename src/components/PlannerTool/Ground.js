import { usePlane } from "@react-three/cannon";
import { Html, Plane } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useMemo } from "react";
import {
  LinearMipMapLinearFilter,
  NearestFilter,
  RepeatWrapping,
  TextureLoader,
  Box3,
  Sphere,
  Vector3,
} from "three";
import AssetSpinner from "../AssetSpinner";

const Ground = ({
  texture,
  showMapGrid,
  groundArgs,
  controlRef,
  currentAsset,
  addModel,
  setCurrentAsset,
  ...props
}) => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  const { camera } = useThree();
  const groundTexture = useMemo(() => {
    const t = new TextureLoader().load(texture);
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.repeat.set(groundArgs[0] / 16, groundArgs[0] / 16);
    return t;
  }, [texture]);

  useEffect(() => {
    if (ref.current) {
      const bbox = new Box3().setFromObject(ref.current);
      const sphere = bbox.getBoundingSphere(new Sphere());
      const { center, radius } = sphere;
      controlRef.current.reset();
      controlRef.current.target.copy(center);
      controlRef.current.maxDistance = 5 * radius;

      camera.position.copy(
        center.clone().add(new Vector3(1 * radius, 0.75 * radius, 1 * radius))
      );
      camera.far = 5 * radius;
      camera.updateProjectionMatrix();
    }
  }, []);

  groundTexture.magFilter = NearestFilter;
  groundTexture.minFilter = LinearMipMapLinearFilter;
  groundTexture.wrapS = RepeatWrapping;
  groundTexture.wrapT = RepeatWrapping;
  groundTexture.repeat.set(groundArgs[0] / 16, groundArgs[0] / 16);

  const XYPlane = () => (
    <Plane
      position={[0, -0.25, 0]}
      args={groundArgs}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshStandardMaterial attach="material" color="#dce2fa" wireframe />
    </Plane>
  );

  return (
    <group>
      <Suspense
        fallback={
          <Html>
            <AssetSpinner />
          </Html>
        }
      >
        <Plane
          onPointerMissed={() => setCurrentAsset("")}
          onClick={(e) => {
            const { x, y, z } = e.point;
            currentAsset && addModel(x, y, z);
          }}
          args={groundArgs}
          receiveShadow
          ref={ref}
        >
          <meshStandardMaterial map={groundTexture} />
        </Plane>
      </Suspense>
      <XYPlane />
      {showMapGrid && <gridHelper args={groundArgs} position={[0, 0.25, 0]} />}
    </group>
  );
};

export default Ground;
