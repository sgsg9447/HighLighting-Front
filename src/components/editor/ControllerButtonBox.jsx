import React, { useCallback, useState, useRef, useEffect } from "react";
import "./ControllerButtonBox.scss";
import useResult from "../../hooks/useResult";
import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";

const ControllerButtonBox = ({ url }) => {
  const { isplaying, setIsplaying } = React.useContext(
    EditorTimePointerContext
  );
  const {
    requestKeywordsData,
    isChatSuper,
    setIsChatSuper,
    isChatKeywords,
    setIsChatKeywords,
  } = useResult();

  const [keywords, setKeywords] = useState("");
  const isTypingRef = useRef(false);

  // 슈퍼챗 버튼 이벤트
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
    } else {
      setIsChatKeywords((prev) => (prev ? 0 : prev + 1));
    }
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
      requestKeywordsData(url, keywords);
    }
  };

  const keywordSearchEvent = () => {
    if (keywords === "") {
      alert("검색 키워드를 입력해주세요!!");
    } else {
      console.log("url", url, "keywords", keywords);
      requestKeywordsData(url, keywords);
    }
  };

  // window Keydown event
  useEffect(() => {
    const handleKeyboardDown = (event) => {
      if (!isTypingRef.current) {
        const keyCode = event.code;
        switch (keyCode) {
          case "Space":
            console.log("sapce실행", isTypingRef.current);
            if (isTypingRef.current) return;
            setIsplaying(!isplaying);
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
  }, [isplaying, isChatKeywords]);

  // window Keyup event
  useEffect(() => {
    const handleKeyboardUp = (event) => {
      if (!isTypingRef.current) {
        const keyCode = event.code;
        switch (keyCode) {
          case "Space":
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
  }, [isplaying, isChatKeywords]);

  return (
    <div className="buttonContainer">
      <div>
        <button
          className="superchat"
          onClick={handleIsChatSuper}
          value={isChatSuper}
        >
          {isChatSuper ? (
            <span className="ON">슈퍼챗</span>
          ) : (
            <span className="OFF">슈퍼챗 </span>
          )}
        </button>
        <button className="keyWord">
          <span
            onClick={() => {
              handleIsChatKeywords();
              keywordSearchEvent();
            }}
          >
            키워드
          </span>
        </button>
        {/* <form onSubmit={onSubmitForm}> */}
        <input
          className="InputBar"
          placeholder="키워드 입력 부분"
          onChange={onChangeInput}
          value={keywords}
          onFocus={() => {
            console.log("포커스이벤트");
            isTypingRef.current = true;
          }}
          onBlur={() => {
            isTypingRef.current = false;
            console.log("블러 이벤트입니다.", isTypingRef.current);
          }}
        />
        {/* </form> */}
        <button className="button3">
          <span>컷 만들기</span>
        </button>
        <button className="button4">
          <span>내보내기</span>
        </button>
      </div>

      {/* 체크용 */}
      <div>
        <form onSubmit={onSubmitForm}></form>
      </div>
    </div>
  );
};

export default ControllerButtonBox;
