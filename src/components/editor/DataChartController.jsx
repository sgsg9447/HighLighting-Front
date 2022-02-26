import React, {useState} from "react";


import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import useResult from "../../hooks/useResult";

function DataChartController() {
  const { pointer } = React.useContext(EditorTimePointerContext);
  const { isChatSuper, setIsChatSuper } = useResult();
  const { isChatSearch, setIsChatSearch } = useResult();
  const [keyword, setKeyword] = useState();

  function handleIsChatSuper() {
    if (isChatSuper === -1) {
      setIsChatSuper(true)
    }
    else {
      setIsChatSuper(prev => !prev);
    }
  }

  function handleIsChatSearch() {
    if (isChatSuper === -1) {
      setIsChatSearch(true)
    }
    else {
      // setIsChatSearch(prev => !prev);
    }
  }
  
  return (
    <>
      <div className="container__chat">
      <h2>Time Pointer = {pointer}</h2>
        <button className="btn__ChatSuper" onClick={handleIsChatSuper} value={isChatSuper}>
          { isChatSuper ? '슈퍼챗 OFF' : '슈퍼챗 ON'}
        </button>
        <button className="btn__ChatKeyWord" onClick={handleIsChatSearch} >
          { isChatSearch ?
          <>
          <span>{keyword}</span>
          <input type="text" onChange={(e) => setKeyword(e.target.value)} required />
          <button type="submit" onSubmit={handleIsChatSearch}>검색</button>
          {/* {console.log(isChatSearch)} */}
          </>
          : '키워드 검색 ON'}
        </button>
      </div>
      <div className="container__video">
        <h2>비디오</h2>
      </div>
      <div className="container__audio">
        <h2>오디오</h2>
      </div>

      {/* <button onClick={() => addTag(pointer)}>북마크</button> */}
      {/* 콘솔에러나서 주석처리해둡니다 - 지훈 */}
      {/* <button onClick={(pointer)}>북마크</button> */}
      {/* <Tags /> */}
    </>
  );
}

export default DataChartController;