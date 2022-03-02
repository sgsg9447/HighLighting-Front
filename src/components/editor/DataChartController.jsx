import React, { useRef, useEffect } from "react";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import useResult from "../../hooks/useResult";
import "./DataChartController.scss";

function DataChartController({ url, duration }) {
  const {
    replayRef,
    pointer,
    isplaying,
    setIsplaying,
    setSeeking,
    callSeekTo,
    setPlayed,
    changePointer,
  } = React.useContext(EditorTimePointerContext);
  const {
    isChatKeywords,
  } = useResult();
  // const [isTyping, setIsTyping] = useState(false);
  // const [isKeywordInputOpen, setIsKeywordInputOpen] = useState(false);
  const isTypingRef = useRef(false);
  // console.log(url);

  // 좌우 화살표 키 누를 때 이동 시간(초)
  const ARROW_MOVING_TIME = 10;
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
        // console.log('isTypingRef.current', isTypingRef.current)
        // console.log('keyEvent', event)
        // event.code = 'Space', 'ArrowLeft', 'ArrowRight'
        // console.log('event.ctrlKey', event.ctrlKey)
        const keyCode = event.code;
        switch (keyCode) {
          case "Space":
            if (isTypingRef.current) return;
            setIsplaying(!isplaying);
            return;
          case "ArrowLeft":
            arrowPlayBarMove(true, ARROW_MOVING_TIME);
            return;
          case "ArrowRight":
            arrowPlayBarMove(false, ARROW_MOVING_TIME);
            return;
          case "ShiftLeft":
            replayRef.current.subKey.isShiftKey = true;
            // console.log('shift keydown')
            return;
          case "ControlLeft":
            replayRef.current.subKey.isCtrlKey = true;
            // console.log('ctrl keydown')
            return;
          case "KeyK":
            if (
              replayRef.current.subKey.isShiftKey &&
              replayRef.current.subKey.isCtrlKey
            ) {
              replayRef.current.saveMarker();
            }
            replayRef.current.wordKey.isK = true;
            // console.log('K keydown')
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
  }, [pointer, isplaying, isChatKeywords]);

  // window Keyup event
  useEffect(() => {
    const handleKeyboardUp = (event) => {
      if (isChatKeywords || !isTypingRef.current) {
        // console.log('isTypingRef.current', isTypingRef.current)
        // console.log('keyEvent', event)
        // event.code = 'Space', 'ArrowLeft', 'ArrowRight'

        const keyCode = event.code;
        switch (keyCode) {
          case "ShiftLeft":
            replayRef.current.subKey.isShiftKey = false;
            // console.log('shift keyup')
            break;
          case "ControlLeft":
            replayRef.current.subKey.isCtrlKey = false;
            // console.log('ctrl keyup')
            break;
          case "keyK":
            replayRef.current.wordKey.isK = false;
            // console.log('K keyup')
            break;
          case "Space":
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

  return (
    <>
      <div className="container__chat">
        <h2>{isChatKeywords ? "채팅 빈도" : "키워드 감지"}</h2>
        <h4>{isChatKeywords ? "높을수록 시청자 반응이 좋은 장면이에요" : "검색한 키워드가 얼마나 등장했는지 보여줘요"}</h4>
        
      </div>
      <div className="container__video">
        <h2>화면 변화</h2>
        <h4>뾰족한 부분이 장면이 바뀌는 부분이에요</h4>
      </div>
      <div className="container__audio">
        <h2>오디오 볼륨</h2>
        <h4>두꺼우면 시끄러운 장면, 얇으면 조용한 장면이에요</h4>
      </div>
    </>
  );
}

export default DataChartController;
