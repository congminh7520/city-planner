import { Typography } from "antd";

const PolygonInfo = ({ polygonSum }) => {
  const infoColor = () => {
    switch (true) {
      case polygonSum >= 10000:
        return "#e04b3a";
      case polygonSum > 6000:
        return "#e0c53a";
      default:
        return "#bdbdbd";
    }
  };

  return (
    <Typography.Text
      style={{ position: "absolute", top: 16, right: 310, color: infoColor() }}
    >
      {polygonSum.toLocaleString()} / 10,000
    </Typography.Text>
  );
};

export default PolygonInfo;
