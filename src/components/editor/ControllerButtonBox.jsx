import React from "react";
import "./ControllerButtonBox.scss";
const ControllerButtonBox = () => {
  return (
    <div className="buttonContainer">
      <div>
        <button className="superchat">
          <span>슈퍼챗</span>
        </button>
        <button className="button2">
          <span>키워드 검색</span>
        </button>
        <input className="InputBar" />
        <button className="button3">
          <span>컷 만들기</span>
        </button>
        <button className="button4">
          <span>내보내기</span>
        </button>
      </div>
    </div>
  );
};

export default ControllerButtonBox;
