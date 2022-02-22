import { useState } from "react";

import EditorTimePointerContext from "../contexts/EditorTimePointerContext";

function EditorTimePointerProvider({ children }) {
  const [isplaying, setIsplaying] = useState(false);
  const [pointer, setPointer] = useState(0);
  const changePointer = (newtime) => {
    setPointer(() => newtime);
  };
  return (
    <EditorTimePointerContext.Provider
      value={{ pointer, changePointer, isplaying, setIsplaying }}
    >
      {children}
    </EditorTimePointerContext.Provider>
  );
}

export default EditorTimePointerProvider;
