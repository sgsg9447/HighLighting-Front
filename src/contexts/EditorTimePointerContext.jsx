import React from "react";

const EditorTimePointerContext = React.createContext({
  pointer: 0,
  changePointer: () => {},
  isplaying: false,
  setIsplaying: () => {},
  seeking: false,
  setSeeking: () => {},
  played: 0,
  setPlayed: () => {},
  callSeekTo: () => {},
  playerRef: undefined,
  setPlayerRef: () => {},
  replayRef: undefined,
  setReplayRef: () => {},
  callReplay: () => {},
  dataChangeRef: undefined,
  setDataChangeRef: () => {},
});

export default EditorTimePointerContext;
