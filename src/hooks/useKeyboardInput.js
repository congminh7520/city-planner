import { message } from "antd";
import { useEffect } from "react";
import { useState } from "react";

const actionByKey = (key) => {
  const keys = {
    w: "moveForward",
    s: "moveBackward",
    a: "moveLeft",
    d: "moveRight",
    " ": "jump",
    Shift: "sprint",
  };
  return keys[key];
};

const textureByKey = (key) => {
  const keys = {
    0: "axe",
    1: "wood",
    2: "dirt",
    3: "glass",
    4: "log",
    5: "grass",
  };
  return keys[key];
};

export const useKeyboardInput = () => {
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    sprint: false,
    jump: false,
  });
  const [texture, setTexture] = useState("axe");
  const [fov, setFov] = useState(true);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (actionByKey(e.key)) {
        setMovement((state) => ({ ...state, [actionByKey(e.key)]: true }));
      }
      if (textureByKey(e.key)) {
        setTexture(textureByKey(e.key));
      }
      if (e.key === "v") setFov(!fov);
    };
    const handleKeyUp = (e) => {
      if (actionByKey(e.key)) {
        setMovement((state) => ({ ...state, [actionByKey(e.key)]: false }));
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });
  return { movement, texture, fov };
};
