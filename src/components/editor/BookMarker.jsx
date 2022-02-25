import React from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import useResult from "../../hooks/useResult";

function BookMarker() {
  const { pointer } = React.useContext(EditorTimePointerContext);
  const { isChatSuperOn, setIsChatSuperOn } = useResult();

  function handleIsChatOn() {
    if (isChatSuperOn === -1) {
      setIsChatSuperOn(true)
    }
    else {
      setIsChatSuperOn(prev => !prev);
    }
  }
  
  return (
    <div className="BookMarkerContainer">
      <h1>북마커 영역</h1>
      <h2>Time Pointer = {pointer}</h2>
      <h3>유저 클릭 북마크의 start 값으로 Time Pointer 변경</h3>
      <button className="ChatSuperButton" onClick={handleIsChatOn} value={isChatSuperOn}>
        { isChatSuperOn ? '슈퍼챗 OFF' : '슈퍼챗 ON'}
      </button>
      {/* <button onClick={() => addTag(pointer)}>북마크</button> */}
      {/* 콘솔에러나서 주석처리해둡니다 - 지훈 */}
      {/* <button onClick={(pointer)}>북마크</button> */}
      {/* <Tags /> */}
    </div>
  );
}

export default BookMarker;