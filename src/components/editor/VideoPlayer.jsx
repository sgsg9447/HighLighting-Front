import React from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import Player from "./in_VideoPlayer/Player";

function VideoPlayer() {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  const [play, setPlay] = React.useState(true);

  function handlePlayPause(isPlaying) {
    setPlay(!isPlaying);
  }

  return (
    <div>
      <h1>비디오 플레이어 영역</h1>
      <Player playing = {play}/>
      <h2>Time Pointer = {pointer}</h2>
      <h3>영상 isPlaying 시 Time Pointer 매 초 변경</h3>
      <button
        onClick={() => {
          changePointer(pointer + 1);
        }}
      >
        버튼
      </button>
      <button
        onClick={() => {
          handlePlayPause(play);
        }}
      >
        재생/정지
      </button>
    </div>
  );
}

export default VideoPlayer;
