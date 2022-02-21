import { useState } from "react";

import EditorTimePointerContext from "../contexts/EditorTimePointerContext";

function EditorTimePointerProvider({ children }) {
  const [pointer, setPointer] = useState(0);
  const changePointer = (newtime) => {
    setPointer(() => newtime);
  };
  return (
    <EditorTimePointerContext.Provider value={{ pointer, changePointer }}>
      {children}
    </EditorTimePointerContext.Provider>
  );
}

export default EditorTimePointerProvider;
