import React from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";

function DataChart() {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  return (
    <div>
      <h1>데이터 차트 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <button onClick={changePointer}>
        유저 클릭 위치에 해당하는 값으로 Time Pointer 변경
      </button>
    </div>
  );
}

export default DataChart;
