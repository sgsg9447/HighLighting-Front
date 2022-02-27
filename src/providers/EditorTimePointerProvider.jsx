import { useState } from "react";

import EditorTimePointerContext from "../contexts/EditorTimePointerContext";

function EditorTimePointerProvider({ children }) {
  const [isplaying, setIsplaying] = useState(false);
  const [pointer, setPointer] = useState(0);
  const changePointer = (newtime) => {
    setPointer(() => newtime);
  };
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playerRef, setPlayerRef] = useState(undefined);
  const [replayRef, setReplayRef] = useState(undefined);
  const [dataChangeRef, setDataChangeRef] = useState(undefined);

  function callSeekTo(value) {
    playerRef.seekTo(parseFloat(value));
  }

  function callReply(pointer, startTime, endTime) {
    replayRef.replay(pointer, startTime, endTime)
  }

  return (
    <EditorTimePointerContext.Provider
      value={{ 
        pointer, changePointer, 
        isplaying, setIsplaying, 
        seeking, setSeeking, 
        played, setPlayed, 
        callSeekTo, 
        playerRef, setPlayerRef, 
        callReply, 
        replayRef, setReplayRef,
        dataChangeRef, setDataChangeRef,
      }}
    >
      {children}
    </EditorTimePointerContext.Provider>
  );
}

export default EditorTimePointerProvider;
