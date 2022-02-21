import React from "react";
import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import "./BookMarker.scss";

function BookMarker() {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  return (
    <div className="BookMarkerContainer">
      <h1>북마커 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <h3>유저 클릭 북마크의 start 값으로 Time Pointer 변경</h3>
      <button
        onClick={() => {
          changePointer(60);
        }}
      >
        00:01:00 ~ 00:02:00
      </button>
      <button
        onClick={() => {
          changePointer(600);
        }}
      >
        00:10:00 ~ 00:11:00
      </button>
      <button
        onClick={() => {
          changePointer(3600);
        }}
      >
        01:00:00 ~ 01:01:00
      </button>
    </div>
  );
}

export default BookMarker;
