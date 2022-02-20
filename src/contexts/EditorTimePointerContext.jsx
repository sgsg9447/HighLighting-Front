import React from "react";

const EditorTimePointerContext = React.createContext({
    pointer : 0,
    changePointer : () => {}
});

export default EditorTimePointerContext;
