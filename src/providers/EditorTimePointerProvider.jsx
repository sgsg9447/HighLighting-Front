import { useState } from "react";

import EditorTimePointerContext from "../contexts/EditorTimePointerContext";

function EditorTimePointerProvider({ children }) {
  const [playing, setPlaying] = useState(true);
  const [pointer, setPointer] = useState(0);
  const changePointer = (newtime) => {
    setPointer(() => newtime);
  };
  return (
    <EditorTimePointerContext.Provider
      value={{ pointer, changePointer, playing, setPlaying }}
    >
      {children}
    </EditorTimePointerContext.Provider>
  );
}

export default EditorTimePointerProvider;
