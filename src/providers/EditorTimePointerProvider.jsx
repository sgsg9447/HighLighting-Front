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

  function callSeekTo(func, value) {
    func.seekTo(parseFloat(value));
  }

  return (
    <EditorTimePointerContext.Provider
      value={{ pointer, changePointer, isplaying, setIsplaying, seeking, setSeeking, played, setPlayed, callSeekTo, playerRef, setPlayerRef }}
    >
      {children}
    </EditorTimePointerContext.Provider>
  );
}

export default EditorTimePointerProvider;
