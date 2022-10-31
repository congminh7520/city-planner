const Crosshair = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: "6px",
          width: "6px",
          backgroundColor: "white",
          borderRadius: "50%",
          border: "solid 1px gray",
          margin: "auto",
        }}
      ></div>
    </div>
  );
};

export default Crosshair;
