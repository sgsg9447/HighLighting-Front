import React from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";

function BookMarker() {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  return (
    <div>
      <h1>북마커 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <button onClick={changePointer}>
        유저 클릭 북마크의 start 값으로 Time Pointer 변경
      </button>
    </div>
  );
}

export default BookMarker;
