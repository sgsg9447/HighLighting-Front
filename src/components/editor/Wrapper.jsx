import React from "react";

function Wrapper({ children }) {
  const style = {
    border: "2px solid black",
    padding: 16,
    display: "flex",
    flexDirection: "row",
  };

  return <div style={style}>{children}</div>;
}

export default Wrapper;
