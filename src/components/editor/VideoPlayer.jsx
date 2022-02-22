import React from "react";

import Player from "./in_VideoPlayer/Player";
import "./VideoPlayer.scss";
function VideoPlayer({url}) {
  return (
    <div className="VideoViewerContainer">
      <div className="VideoPlayer">
        <Player url={url} />
      </div>
    </div>
  );
}

export default VideoPlayer;