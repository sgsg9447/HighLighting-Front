import React, { useState, useRef, useEffect } from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import useResult from "../../hooks/useResult";

import { format } from "./in_VideoPlayer/Duration";
import "./ChatViewer.scss";
function ChatViewer({ url, duration }) {
  const {
    replayRef,
    pointer,
    isplaying,
    setSeeking,
    callSeekTo,
    setPlayed,
    changePointer,
  } = React.useContext(EditorTimePointerContext);
  const { isChatKeywords } = useResult();
  const isTypingRef = useRef(false);

  // 좌우 화살표 키 누를 때 이동 시간(초)
  const ARROW_MOVING_TIME = 5;
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

  // window Keydown event
  useEffect(() => {
    const handleKeyboardDown = (event) => {
      if (isChatKeywords || !isTypingRef.current) {
        const keyCode = event.code;
        switch (keyCode) {
          case "ArrowLeft":
            arrowPlayBarMove(true, ARROW_MOVING_TIME);
            return;
          case "ArrowRight":
            arrowPlayBarMove(false, ARROW_MOVING_TIME);
            return;
          case "ShiftLeft":
            replayRef.current.subKey.isShiftKey = true;
            return;
          case "ControlLeft":
            replayRef.current.subKey.isCtrlKey = true;
            return;
          case "KeyS":
            if (
              replayRef.current.subKey.isShiftKey &&
              replayRef.current.subKey.isCtrlKey
            ) {
              replayRef.current.saveMarker();
            }
            replayRef.current.wordKey.isS = true;
            return;
          default:
            return;
        }
      }
    };
    window.addEventListener("keydown", handleKeyboardDown);
    return () => {
      window.removeEventListener("keydown", handleKeyboardDown);
    };
  }, [url, pointer, isplaying, isChatKeywords]);

  // window Keyup event
  useEffect(() => {
    const handleKeyboardUp = (event) => {
      if (isChatKeywords || !isTypingRef.current) {
        const keyCode = event.code;
        switch (keyCode) {
          case "ShiftLeft":
            replayRef.current.subKey.isShiftKey = false;
            break;
          case "ControlLeft":
            replayRef.current.subKey.isCtrlKey = false;
            break;
          case "KeyS":
            replayRef.current.wordKey.isS = false;
            break;
          case "ArrowLeft":
            break;
          case "ArrowRight":
            break;
          default:
            return;
        }
      }
    };
    window.addEventListener("keyup", handleKeyboardUp);
    return () => {
      window.removeEventListener("keyup", handleKeyboardUp);
    };
  }, [url, pointer, isplaying, isChatKeywords]);

  // 키워드 검색커서 벗어나기 위해 배경 클릭하면, 키보드 재생/중지 가능하도록 이벤트
  useEffect(() => {
    const handleClickOutside = () => {
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
      if (Math.abs(prevPointer - pointer) > 4) {
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
    </div>
  );
}

export default ChatViewer;
