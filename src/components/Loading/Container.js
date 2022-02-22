// components/Container/index.js
import React from "react";
import "./Container.scss";

const Container = (props) => (
  <div className="FlexBox">
    <div className="ContainerWrapper">{props.children}</div>
  </div>
);
export default Container;
