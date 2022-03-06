import React, { useState, useRef, useCallback } from "react";

import useResult from "../hooks/useResult";
import useRoute from "../hooks/useRoute";
import Header from "../components/Header/Header";
import { GiPlayButton } from "react-icons/gi";
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
        activeZero();
        break;
      case "first":
        activeFirst();
        break;
      case "second":
        activeSecond();
        break;
      case "third":
        activeThird();
        break;
      case "fourth":
        activeFourth();
        break;
      case "fifth":
        activeFifth();
        break;
      default:
    }
  };

  const viewChange = () => {
    document.getElementById("guidline").scrollIntoView({ behavior: "smooth" });
  };
  const activeZero = () => {
    setActive0(true);
    setActive1(false);
    setActive2(false);
    setActive3(false);
    setActive4(false);
    setActive5(false);
  };

  const activeFirst = () => {
    setActive0(false);
    setActive1(true);
    setActive2(false);
    setActive3(false);
    setActive4(false);
    setActive5(false);
  };

  const activeSecond = () => {
    setActive0(false);
    setActive1(false);
    setActive2(true);
    setActive3(false);
    setActive4(false);
    setActive5(false);
  };

  const activeThird = () => {
    setActive0(false);
    setActive1(false);
    setActive2(false);
    setActive3(true);
    setActive4(false);
    setActive5(false);
  };

  const activeFourth = () => {
    setActive0(false);
    setActive1(false);
    setActive2(false);
    setActive3(false);
    setActive4(true);
    setActive5(false);
  };

  const activeFifth = () => {
    setActive0(false);
    setActive1(false);
    setActive2(false);
    setActive3(false);
    setActive4(false);
    setActive5(true);
  };

  return (
    <div>
      <Header logged={logged} onLogout={onLogout} />
      <div className="HomeContainer">
        <div className="UpperContainer">
          <div className="upper_left_container">
            {/* 좌상단 소개 페이지 */}
            <div>
              <h1 className="HC1_heading anim">
                <img className="HC1-logo" src={require("./image/icon.png")} />
                HIGHLIGHTING
              </h1>
              <p className="HC1-p1">
                저희 웹 서비스{" "}
                <span className="point1">하이라이팅(HIGHLIGHTING)</span>은 영상
                url만을 통해 해당 영상을 분석하여 편집점을 찾는데 도움이 되는
                데이터와 서비스들을 제공합니다.
              </p>
              <p className="HC1-p2">
                긴 시간이 걸리는 영상 원본의 편집접 찾기를 저희 웹서비스{" "}
                <span className="point1">하이라이팅</span>이 제공하는 데이터와
                서비스를 통해 빠른시간에 처리해보세요!{" "}
              </p>
              <p className="HC1-p3">
                {" "}
                홈페이지 하단부분에
                <span className="point1"> 가이드라인</span>에 단계별 사용법을
                기재해 놨습니다. 사용방법으로 빠르게 이동하길 원하신다면{" "}
                <span className="point2" onClick={viewChange}>
                  클릭
                </span>
                해주세요!
              </p>
              <p className="HC1-p4">
                Creating and Providing Services :{" "}
                <span className="point1">Team HIGHLIGHTING</span>
              </p>
            </div>
            {/* 좌상단 소개 페이지 */}
          </div>
          <div className="upper_right_container">
            {/* 우상단 URL 입력창 */}
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
            {/* 우상단 URL 입력창 */}
          </div>
        </div>

        <div className="LowerContainer">
          <div className="lower_left_container">
            {/* 좌하단 가이드라인 */}
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
                    0단계 - 홈페이지
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active0 ? "sub-active" : "")
                    }
                  >
                    다시보기 영상 링크만으로 영상을 분석하여 편집에 도움이 되는
                    데이터들을 제공합니다.
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
                    1단계 - 편집점 분석
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active1 ? "sub-active" : "")
                    }
                  >
                    url을 입력하면 데이터 분석에 어느정도 시간이 소요됩니다.
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
                    2단계 - 결과 페이지
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active2 ? "sub-active" : "")
                    }
                  >
                    결과 페이지에서는 다양한 기능을 제공합니다.
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
                    3단계 - 북마크 기능
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active3 ? "sub-active" : "")
                    }
                  >
                    원하는 부분을 기록 ~ 종료함으로써 북마크 형식으로 남길 수
                    있습니다.
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
                    4단계 - 차트 데이터
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active4 ? "sub-active" : "")
                    }
                  >
                    차트 데이터의 세로축은 해당 데이터의 크기, 가로축은 영상의
                    시간 흐름을 의미합니다.
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
                    5단계 - 로그인 기능
                  </p>
                  <p
                    className={
                      "Home_list-sub" + " " + (active5 ? "sub-active" : "")
                    }
                  >
                    아직은 공란. 현재 쿼리스트링 구현 예정중
                  </p>
                  <p>
                    <br />
                    <br />
                    <a className="UPscroll">
                      <span
                        className="point2"
                        onClick={() => {
                          document
                            .getElementById("Home")
                            .scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        상단
                      </span>
                      으로 돌아가기
                    </a>
                  </p>
                </div>
              </li>
            </ul>
            {/* 좌하단 가이드라인 */}
          </div>
          <div className="lower_right_container">
            {/* 우하단 내용 컨테이너 */}
            <div className="Home_GuidelineContainer" id="guideContainer">
              {active0 ? (
                <div className="GuideLine_content">
                  <h2>HIGHLIGHTING 사용방법</h2>
                  <div className="guide_content_box">
                    <img src={require("./image/Step0.png")} />
                    <p className="guide_content_p1">
                      1.메인페이지 URL창에 유튜브 다시보기 URL을 입력한다.
                    </p>
                    <p className="guide_content_p2">2.결과보기 클릭!</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        activeFifth();
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        activeFirst();
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {active1 ? (
                <div className="GuideLine_content">
                  <h2>편집점 분석</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        activeZero();
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        activeSecond();
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {active2 ? (
                <div className="GuideLine_content">
                  <h2>결과 페이지</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        activeFirst();
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        activeThird();
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {active3 ? (
                <div className="GuideLine_content">
                  <h2>북마크 기능</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={activeSecond}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={activeFourth}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {active4 ? (
                <div className="GuideLine_content">
                  <h2>차트 데이터</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        activeThird();
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        activeFifth();
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {active5 ? (
                <div className="GuideLine_content">
                  <h2>로그인 기능</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        activeFourth();
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        activeZero();
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            {/* 우하단 내용 컨테이너 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
