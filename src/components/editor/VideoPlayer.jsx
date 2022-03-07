import React from "react";

import Player from "./in_VideoPlayer/Player";
import "./VideoPlayer.scss";
function VideoPlayer({ url }) {
  return (
    <div className="VideoViewerContainer">
      <div className="VideoPlayer">
        <Player url={url} />
      </div>
      {/* <div className="video-controller1">재생바</div>
      <div className="video-controller2">
        <div className="">뒤로가기</div>
        <div>중지,재생</div>
        <div>앞으로가기</div>
      </div> */}
    </div>
  );
}

export default VideoPlayer;
