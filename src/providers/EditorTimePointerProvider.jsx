import { useState } from "react";

import EditorTimePointerContext from "../contexts/EditorTimePointerContext";

function EditorTimePointerProvider ({ children }) {
  const [pointer, setPointer] = useState(0);
  const changePointer = () => {
    setPointer((pointer) => (pointer + 1));
  };
  return (
      <EditorTimePointerContext.Provider value={{pointer, changePointer}}>
          {children}
      </EditorTimePointerContext.Provider>
  );
}

export default EditorTimePointerProvider;
