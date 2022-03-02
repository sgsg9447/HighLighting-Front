import React, { useState, useCallback, useRef, useEffect } from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import useResult from "../../hooks/useResult";

import { format } from "./in_VideoPlayer/Duration";
import "./ChatViewer.scss";
function ChatViewer({ url, duration }) {
  const {
    pointer,
    isplaying,
    setIsplaying,
    setSeeking,
    callSeekTo,
    setPlayed,
    changePointer,
  } = React.useContext(EditorTimePointerContext);
  const {
    requestKeywordsData,
    isChatSuper,
    setIsChatSuper,
    isChatKeywords,
    setIsChatKeywords,
  } = useResult();
  const [keywords, setKeywords] = useState("");
  // const [isTyping, setIsTyping] = useState(false);
  // const [isKeywordInputOpen, setIsKeywordInputOpen] = useState(false);
  const isTypingRef = useRef(false);
  const inputRef = useRef();
  // console.log(url);

  // 좌우 화살표 키 누를 때 이동 시간(초)
  const ARROW_MOVING_TIME = 10;

  function handleIsChatSuper() {
    if (isChatSuper === -1) setIsChatSuper(false);
    else {
      setIsChatSuper((prev) => !prev);
    }
  }

  function handleIsChatKeywords() {
    // isChatKeywords ? 닫힌상태 : 열린상태
    if (isChatKeywords === -1) {
      setIsChatKeywords((prev) => prev + 1);
      isTypingRef.current = true;
    } else {
      if (!isChatKeywords) {
        isTypingRef.current = false;
      }
      setIsChatKeywords((prev) => (prev ? 0 : prev + 1));
    }
  }

  // 기존 제출 버튼(필요없을 수도 있음)
  function postUrlKeyword(e) {
    console.log("url", url, "keywords", keywords);
    // getMethodKeywords(e);
    requestKeywordsData(url, keywords);
    localStorage.setItem("localSearchKeywords", keywords);
    inputRef.current.focus();
  }

  const onChangeInput = useCallback((e) => {
    console.log("onChangeInput");
    isTypingRef.current = true;
    const tmpKeywords = e.target.value;
    setKeywords(tmpKeywords);
  }, []);

  // form 형식, Enter로도 제출가능, 인풋창 안으로 커서유지
  const onSubmitForm = (e) => {
    console.log("onSubmitForm");
    e.preventDefault();
    if (keywords === "") {
      setKeywords("키워드를 입력해주세요.");
    } else {
      console.log("url", url, "keywords", keywords);
      // getMethodKeywords(e);
      requestKeywordsData(url, keywords);
      localStorage.setItem("localSearchKeywords", keywords);
      const cursor = inputRef.current.focus();
      console.log(cursor);
      inputRef.current.focus();
      isTypingRef.current = false;
    }
  };

  // 좌, 우 화살표 재생 이동 함수
  function arrowPlayBarMove(isLeft, padding = 10) {
    setSeeking(true);
    let playTime;
    if (isLeft) {
      playTime = pointer - padding;
    } else {
      playTime = pointer + padding;
    }
    let playTimeRatio = playTime / duration;
    callSeekTo(playTimeRatio);
    setPlayed(parseFloat(playTimeRatio));
    changePointer(playTime);
    setSeeking(false);
  }

  // window keyboard event 스페이스 바 재생/중지, 화살표 좌우 재생이동
  useEffect(() => {
    const handlePushSpaceBar = (event) => {
      if (isChatKeywords || !isTypingRef.current) {
        // console.log('isTypingRef.current', isTypingRef.current)
        // console.log('keyEvent', event)
        // event.code = 'Space', 'ArrowLeft', 'ArrowRight'
        const keyCode = event.code;
        switch (keyCode) {
          case "Space":
            setIsplaying(!isplaying);
            return;
          case "ArrowLeft":
            arrowPlayBarMove(true, ARROW_MOVING_TIME);
            return;
          case "ArrowRight":
            arrowPlayBarMove(false, ARROW_MOVING_TIME);
            return;
          default:
            return;
        }
      }
    };
    window.addEventListener("keydown", handlePushSpaceBar);
    return () => {
      window.removeEventListener("keydown", handlePushSpaceBar);
    };
  }, [pointer, isplaying, isChatKeywords]);

  // 키워드 검색커서 벗어나기 위해 배경 클릭하면, 키보드 재생/중지 가능하도록 이벤트
  useEffect(() => {
    const handleClickOutside = ({ target }) => {
      // console.log('click', target.className)
      isTypingRef.current = false;
      return window.removeEventListener("click", handleClickOutside);
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isTypingRef, pointer]);

  const [data, setData] = useState();
  const [flow, setFlow] = useState([]);
  const scroll = document.querySelector("#scroll");
  const [prevPointer, setPrevPointer] = useState(0);

  useEffect(() => {
    const chatData = localStorage.getItem("localChatSet");
    setData(JSON.parse(chatData));
    if (JSON.parse(chatData)[0] !== undefined) {
      setFlow([
        JSON.parse(chatData)[0].map((value) => pointer + " : " + value),
      ]);
    }
  }, []);

  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      if (Math.abs(prevPointer - pointer) > 5) {
        setFlow([]);
      }
      if (data[pointer] !== undefined) {
        setFlow((flow) => [
          ...flow,
          data[pointer].map((value) => format(pointer) + " : " + value),
        ]);
      }
      scroll.scrollTop = scroll.scrollHeight;
      setPrevPointer(pointer);
    }
  }, [pointer]);

  return (
    <div className="ChatViewerContainer">
      <div>
        <div className="ChatViewer" id="scroll">
          {flow.map((value, index) =>
            value ? (
              <div key={index}>
                {value.map((each, idx) =>
                  each ? <div key={idx}>{each}</div> : null
                )}
              </div>
            ) : null
          )}
        </div>
      </div>
      <div>
        <button
          className="btn__ChatSuper"
          onClick={handleIsChatSuper}
          value={isChatSuper}
        >
          {isChatSuper ? "슈퍼챗 통계" : "슈퍼챗 OFF"}
        </button>
        <button className="btn__ChatKeyWord" onClick={handleIsChatKeywords}>
          {isChatKeywords ? "키워드 검색" : "키워드 검색"}
        </button>
        {isChatKeywords ? null : (
          <form onSubmit={onSubmitForm}>
            <input
              className="keywordInputBar"
              ref={inputRef}
              placeholder="키워드 , 으로 구분해주세요"
              value={keywords}
              onChange={onChangeInput}
            />
            <button type="submit" onClick={postUrlKeyword}>
              검색
            </button>
            <h3 className = 'hide'>
              [검색 키워드]:{" "}
              {keywords ? keywords : localStorage.getItem("localSearchKeyword")}
            </h3>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChatViewer;
