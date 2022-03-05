import React, { useState, useRef, useCallback } from "react";

import useResult from "../hooks/useResult";
import useRoute from "../hooks/useRoute";
import Header from "../components/Header/Header";
import "./Home.scss";
const Home = () => {
  const inputValue = document.getElementById("link");
  const urlInput = useRef();

  const { logged, onLogout } = useResult();
  const { url, setUrl } = useResult();
  const { requestResult } = useRoute();
  const [active0, setActive0] = useState(true);
  const [active1, setActive1] = useState(false);
  const [active2, setActive2] = useState(false);
  const [active3, setActive3] = useState(false);
  const [active4, setActive4] = useState(false);
  const [active5, setActive5] = useState(false);

  // useEffect(() => {
  //   const value = document.querySelector(".Home_list");
  //   console.log(value);

  //   const handleClickEvent = (e) => {
  //     const value2 = e.target.id;
  //     console.log(value2);
  //   };
  //   value.addEventListener("click", handleClickEvent);
  // });

  const onChangeUrl = useCallback((e) => {
    const value = e.target.value;
    setUrl(value);
  });

  function linkCheck() {
    if (inputValue === null) {
      alert("빈 값입니다. 입력창에 유튜브 주소를 입력해 주세요.");
      focusUrl();
      return;
    } else if (inputValue !== null) {
      const gapCheck = inputValue.value.split(" ");
      const correctLink = inputValue.value.substr(0, 32);
      const backAddressCheck = inputValue.value.split("=");
      if (gapCheck.length === 2) {
        alert(
          "유튜브 링크에 공백 문자가 포함되어 있습니다. 공백 문자를 제거한 주소를 입력해 주세요."
        );
        focusUrl();
        return;
      }
      if (correctLink !== "https://www.youtube.com/watch?v=") {
        alert(
          "올바른 유튜브 주소가 아닙니다. 올바른 유튜브 링크 주소를 입력해 주세요1."
        );
        console.log(correctLink);
        focusUrl();
        return;
      }
      if (backAddressCheck[1].length !== 11) {
        console.log(backAddressCheck, backAddressCheck[1].length);
        alert(
          "올바른 유튜브 주소가 아닙니다. 올바른 유튜브 링크 주소를 입력해 주세요2."
        );
        focusUrl();
        return;
      }
      sendUrl();
    }
  }

  function sendUrl(e) {
    console.log("call sendUrl()");
    if (inputValue && inputValue.value) {
      console.log("인풋창 입력값 : ", inputValue.value);
      requestResult(url);
    }
  }

  function focusUrl() {
    if (inputValue === null) return;
    inputValue.value = "";
    urlInput.current.focus();
  }

  const onClickGuide = (e) => {
    const id = e.target.id;
    switch (id) {
      case "zero":
        console.log("zero다요");
        setActive0(true);
        setActive1(false);
        setActive2(false);
        setActive3(false);
        setActive4(false);
        setActive5(false);
        break;
      case "first":
        setActive0(false);
        setActive1(true);
        setActive2(false);
        setActive3(false);
        setActive4(false);
        setActive5(false);
        break;
      case "second":
        setActive0(false);
        setActive1(false);
        setActive2(true);
        setActive3(false);
        setActive4(false);
        setActive5(false);
        break;
      case "third":
        setActive0(false);
        setActive1(false);
        setActive2(false);
        setActive3(true);
        setActive4(false);
        setActive5(false);
        break;
      case "fourth":
        setActive0(false);
        setActive1(false);
        setActive2(false);
        setActive3(false);
        setActive4(true);
        setActive5(false);
        break;
      case "fifth":
        setActive0(false);
        setActive1(false);
        setActive2(false);
        setActive3(false);
        setActive4(false);
        setActive5(true);
        break;
      default:
        console.log("아무일도 없었다");
    }
  };

  return (
    <div>
      <Header logged={logged} onLogout={onLogout} />
      <div className="HomeContainer">
        <div className="Home_main">
          <div className="Home_Column1">
            <div>
              <h1 className="HC1_heading">
                <img className="HC1-logo" src={require("./image/icon.png")} />
                HIGHLIGHTING
              </h1>
              <p className="HC1-p1">
                저희 웹 서비스{" "}
                <span className="point1">하이라이팅(HIGHLIGHTING)</span>은 영상
                url만을 통해 해당 영상을 분석하여 편집점을 찾는데 도움이 되는
                데이터와 서비스들을 제공합니다.
              </p>
              <p className="HC1-p1">
                긴 시간이 걸리는 영상 원본의 편집접 찾기를 저희 웹서비스{" "}
                <span className="point1">하이라이팅</span>이 제공하는 데이터와
                서비스를 통해 빠른시간에 처리해보세요!{" "}
              </p>
              <p className="HC1-p2">
                {" "}
                홈페이지 하단부분에
                <span className="point1"> 가이드라인</span>에 단계별 사용법을
                기재해 놨습니다. 사용방법으로 빠르게 이동하길 원하신다면{" "}
                <span
                  className="point2"
                  onClick={() => {
                    document
                      .getElementById("guidline")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  클릭
                </span>
                해주세요!
              </p>
              <p className="HC1-p3">
                Creating and Providing Services :{" "}
                <span className="point1">Team HIGHLIGHTING</span>
              </p>
            </div>
            <div className="Home_introduction_heading_wrap">
              <h2 id="guidline"> 단계별 가이드라인 </h2>
            </div>
            <ul className="Home_list">
              <li className="Home_list-item">
                <div>
                  <p
                    className={
                      "Home_list-content" + " " + (active0 ? "is-active" : "")
                    }
                    id="zero"
                    onMouseEnter={onClickGuide}
                  >
                    0단계
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active0 ? "sub-active" : "")
                    }
                  >
                    0단계 내용
                  </p>
                </div>
              </li>

              <li className="Home_list-item">
                <div className="Home_list-content-wrap">
                  <p
                    className={
                      "Home_list-content" + " " + (active1 ? "is-active" : "")
                    }
                    id="first"
                    onMouseEnter={onClickGuide}
                  >
                    1단계
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active1 ? "sub-active" : "")
                    }
                  >
                    1단계 내용
                  </p>
                </div>
              </li>

              <li className="Home_list-item">
                <div className="Home_list-item-image"></div>
                <div className="Home_list-content-wrap">
                  <p
                    className={
                      "Home_list-content" + " " + (active2 ? "is-active" : "")
                    }
                    id="second"
                    onMouseEnter={onClickGuide}
                  >
                    2단계
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active2 ? "sub-active" : "")
                    }
                  >
                    2단계 내용
                  </p>
                </div>
              </li>

              <li className="Home_list-item">
                <div className="Home_list-content-wrap">
                  <p
                    className={
                      "Home_list-content" + " " + (active3 ? "is-active" : "")
                    }
                    id="third"
                    onMouseEnter={onClickGuide}
                  >
                    3단계
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active3 ? "sub-active" : "")
                    }
                  >
                    3단계 내용
                  </p>
                </div>
              </li>

              <li className="Home_list-item">
                <div className="Home_list-content-wrap">
                  <p
                    className={
                      "Home_list-content" + " " + (active4 ? "is-active" : "")
                    }
                    id="fourth"
                    onMouseEnter={onClickGuide}
                  >
                    4단계
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active4 ? "sub-active" : "")
                    }
                  >
                    4단계 내용
                  </p>
                </div>
              </li>

              <li className="Home_list-item">
                <div className="Home_list-item-image"></div>
                <div className="Home_list-content-wrap">
                  <p
                    className={
                      "Home_list-content" + " " + (active5 ? "is-active" : "")
                    }
                    id="fifth"
                    onMouseEnter={onClickGuide}
                  >
                    5단계
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active5 ? "sub-active" : "")
                    }
                  >
                    5단계 내용
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="Home_Column2">
            <div className="Home_urlInput">
              <h1>URL 입력창</h1>
              <input
                className="InputBar"
                ref={urlInput}
                placeholder="다시보기 영상 URL을 입력해주세요"
                onChange={onChangeUrl}
                id="link"
              />
              <h3>URL : {url}</h3>
              <button className="resultButton" onClick={linkCheck}>
                <span>결과 보기</span>
              </button>
            </div>
            <div className="Home_GuidelineContainer">
              <div>{active0 ? <p>0단계 내용이다.</p> : ""}</div>
              <div>{active1 ? <p>1단계 내용이다.</p> : ""}</div>
              <div>{active2 ? <p>2단계 내용이다.</p> : ""}</div>
              <div>{active3 ? <p>3단계 내용이다.</p> : ""}</div>
              <div>{active4 ? <p>4단계 내용이다.</p> : ""}</div>
              <div>{active5 ? <p>5단계 내용이다.</p> : ""}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
