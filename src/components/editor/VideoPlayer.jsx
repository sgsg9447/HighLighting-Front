import React from "react";

import Player from "./in_VideoPlayer/Player";
import "./VideoPlayer.scss";
function VideoPlayer({url}) {
  return (
    <div className="VideoViewerContainer">
      <Player url={url} />
    </div>
  );
}

export default VideoPlayer;