import React, { useState, useCallback, useRef } from "react";


import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import useResult from "../../hooks/useResult";

function DataChartController({ url }) {
  const { pointer } = React.useContext(EditorTimePointerContext);
  const { requestKeywordsData, isChatSuper, setIsChatSuper, isChatKeywords, setIsChatKeywords } = useResult();
  const [keywords, setKeywords] = useState('');
  // const [isKeywordInputOpen, setIsKeywordInputOpen] = useState(false);
  const keywordInputRef = useRef();
  // console.log(url);

  function handleIsChatSuper() {
    if (isChatSuper === -1)
      setIsChatSuper(false)
    else {
      setIsChatSuper(prev => !prev);
    }
    console.log('isChatSuper', isChatSuper);
  }

  function handleIsChatKeywords() {
    if (isChatKeywords === -1)
      setIsChatKeywords(prev => prev+ 1);
    else {
      setIsChatKeywords(prev => prev? 0 : prev + 1);
    }
  }

  function postUrlKeyword() {
    console.log('url', url, 'keywords', keywords);
    // getMethodKeywords(e);
    requestKeywordsData(url, keywords);
    localStorage.setItem('localSearchKeywords', keywords)
  }

  const onChangeInput = useCallback((e) => {
    const tmpKeywords = e.target.value;
    setKeywords(tmpKeywords);
  }, []);


  return (
    <>
      <div className="container__chat">
        <h2>Time Pointer = {pointer}</h2>

        <button className="btn__ChatSuper" onClick={handleIsChatSuper} value={isChatSuper}>
          {isChatSuper ? '슈퍼챗 ON' : '슈퍼챗 OFF'}
        </button>

        <button className="btn__ChatKeyWord" onClick={handleIsChatKeywords}>{isChatKeywords ? '키워드 검색 ON' : '키워드 검색 OFF'}</button>
          {isChatKeywords ?
            null :
            <>
              <input
                className="keywordInputBar"
                ref={keywordInputRef}
                placeholder="키워드 , 으로 구분해주세요"
                value={keywords}
                onChange={onChangeInput}
              />
              <button type="submit" onClick={postUrlKeyword}>검색</button>
              <h3>[검색 키워드]: {keywords ? keywords : localStorage.getItem('localSearchKeyword')}</h3>
            </>
          }
      </div>
      <div className="container__video">
        <h2>비디오</h2>
      </div>
      <div className="container__audio">
        <h2>오디오</h2>
      </div>
    </>
  );
}

export default DataChartController;