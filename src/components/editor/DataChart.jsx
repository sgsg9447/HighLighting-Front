import React from "react";
import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import "./DataChart.scss";
function DataChart() {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  return (
    <div className="DataChartContainer">
      <h1>데이터 차트 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <h3>유저 클릭 위치에 해당하는 값으로 Time Pointer 변경</h3>
      <button
        onClick={() => {
          changePointer(pointer + 1);
        }}
      >
        GET
      </button>
    </div>
  );
}

export default DataChart;
