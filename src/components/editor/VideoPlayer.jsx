import React from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import Player from "./in_VideoPlayer/Player";
import "./VideoPlayer.scss";
function VideoPlayer({url}) {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);
  const [play, setPlay] = React.useState(true);

  function handlePlayPause(isPlaying) {
    setPlay(!isPlaying);
  }

  return (
    <div className="VideoViewerContainer">
      <Player url={url} />
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