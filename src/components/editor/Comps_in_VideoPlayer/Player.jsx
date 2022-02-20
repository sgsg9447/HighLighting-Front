import React from "react";
import ReactPlayer from 'react-player';

import useResult from "../../../hooks/useResult";


function Player(props) {
  const { url } = useResult();
  const isPlaying = props.playing
  return (
      <ReactPlayer url={url} playing={isPlaying} />
  );
}

export default Player;
