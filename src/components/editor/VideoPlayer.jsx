import React from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";

function VideoPlayer() {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  return (
    <div>
      <h1>비디오 플레이어 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <button onClick={changePointer}>
        영상 isPlaying 시 Time Pointer 매 초 변경
      </button>
    </div>
  );
}

export default VideoPlayer;
