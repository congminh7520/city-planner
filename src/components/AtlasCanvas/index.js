import { useState, useEffect, useRef } from "react";

import config from "../../config";
import { rgbToHex } from "../../helpers/util";

const AtlasCanvas = ({
  width,
  height,
  setAtlasData,
  updateMap,
  currentType,
  setImgLoad,
  previousMap,
  currentMap,
  setCurrentAtlasPositionColor,
  disabledDraw,
  setMousePosition,
  atlasData,
}) => {
  const canvasRef = useRef();
  const initRectPos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const [rectPos, setRectPos] = useState(initRectPos);
  const [isDraw, setIsDraw] = useState(false);
  const [currentMapId, setCurrentMapId] = useState("");
  const [imageData, setImageData] = useState();

  useEffect(() => {
    renderImage();
  }, [updateMap, currentMap]);

  useEffect(() => {
    setIsDraw(true);
  }, [atlasData]);

  useEffect(() => {
    if (!disabledDraw && imageData && isDraw) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(imageData, 0, 0);
      context.fillStyle = currentType ? currentType.color : "";
      context.fillRect(
        (atlasData?.x1 + width) / 2,
        (height - atlasData?.y1) / 2,
        (atlasData?.x2 + width) / 2 - (atlasData?.x1 + width) / 2,
        (height - atlasData?.y2) / 2 - (height - atlasData?.y1) / 2
      );
    }
  }, [atlasData, imageData, isDraw]);

  const renderImage = (check = true) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    check && setCurrentMapId(updateMap);
    const imgUrl = `${config.app.currentMapHost}?${
      check ? updateMap : currentMapId
    }`;
    image.onload = () => {
      setImgLoad(false);
      context.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      check &&
        setImageData(context.getImageData(0, 0, canvas.width, canvas.height));
    };
    image.src = previousMap ? previousMap : imgUrl;
    image.setAttribute("crossOrigin", "");
  };

  const calculateAtlasPosition = (value, type) => {
    switch (type) {
      case "x1":
        return value === 0 ? value : value * 2 - width;
      case "x2":
        return value === 0 ? value : value * 2 - width;
      case "y1":
        return value === 0 ? value : height - value * 2;
      case "y2":
        return value === 0 ? value : height - value * 2;
    }
  };

  useEffect(() => {
    if (!isDraw && currentType && !disabledDraw) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = currentType.color;
      context.fillRect(rectPos.x, rectPos.y, rectPos.width, rectPos.height);
      setAtlasData({
        x1: calculateAtlasPosition(rectPos.x, "x1"),
        x2: calculateAtlasPosition(rectPos.width + rectPos.x, "x2"),
        y1: calculateAtlasPosition(rectPos.y, "y1"),
        y2: calculateAtlasPosition(rectPos.height + rectPos.y, "y2"),
      });
    }
  }, [isDraw, rectPos, currentType]);

  const startDraw = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setRectPos(initRectPos);
    if (currentType && !disabledDraw) {
      setIsDraw(true);
      renderImage(false);
      setRectPos({ ...rectPos, x: offsetX, y: offsetY });
    }
  };

  const stopDraw = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDraw) {
      setRectPos({
        ...rectPos,
        width: offsetX - rectPos.x, // calculate width of object
        height: offsetY - rectPos.y, // calculate height of object
      });
    }
    setIsDraw(false);
  };

  const mouseMove = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    // Pick image color
    var imageData = context.getImageData(offsetX, offsetY, 1, 1).data;
    const hexColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
    setCurrentAtlasPositionColor(hexColor);
    setMousePosition({
      x: calculateAtlasPosition(offsetX, "x1"),
      y: calculateAtlasPosition(offsetY, "y1"),
    });
  };

  return (
    <canvas
      onMouseDown={startDraw}
      onMouseUp={stopDraw}
      onMouseMove={mouseMove}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
};

export default AtlasCanvas;
