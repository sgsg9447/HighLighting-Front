import React from "react";

const EditorTimePointerContext = React.createContext({
  pointer: 0,
  changePointer: () => {},
  isplaying: false,
  setIsplaying: () => {}
});

export default EditorTimePointerContext;
