import React from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";

function CommunicationTool() {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  return (
    <div>
      <h1>커뮤니케이션 툴 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <button
        onClick={() => {
          changePointer(pointer);
        }}
      >
        얘가 바꿀일은 없음
      </button>
    </div>
  );
}

export default CommunicationTool;
