import React from "react";

import EditorTimePointerContext from  "../../contexts/EditorTimePointerContext";

function ChatViewer() {
  const {pointer, changePointer} = React.useContext(EditorTimePointerContext);
  return (
    <div>
      <h1>채팅 뷰어 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <button onClick={changePointer}>
        얘가 바꿀일은 없음
      </button>
    </div>
  );
}

export default ChatViewer;
