import React, { useState, useRef, useCallback } from "react";
import classnames from "classnames";
import useResult from "../hooks/useResult";
import useRoute from "../hooks/useRoute";
import Header from "../components/Header/Header";
import { GiPlayButton } from "react-icons/gi";
import "./Home.scss";

const GuideLineStep = {
  Zero: "Zero",
  First: "First",
  Second: "Second",
  Third: "Third",
};

const GuideLineInfoList = {
  [GuideLineStep.Zero]: {
    title: "0단계 - 홈페이지",
    description:
      "다시보기 영상 링크만으로 영상을 분석하여 편집에 도움이 되는 데이터들을 제공합니다.",
  },
  [GuideLineStep.First]: {
    title: "1단계 - 편집점 분석",
    description: "url을 입력하면 데이터 분석에 어느정도 시간이 소요됩니다.",
  },
  [GuideLineStep.Second]: {
    title: "2단계 - 결과 페이지",
    description: "결과 페이지에서는 다양한 기능을 제공합니다.",
  },
  [GuideLineStep.Third]: {
    title: "3단계 - 북마크 기능",
    description:
      "원하는 부분을 기록 ~ 종료함으로써 북마크 형식으로 남길 수 있습니다.",
  },
};

const Home = () => {
  const inputValue = document.getElementById("link");
  const urlInput = useRef();

  const { logged, onLogout } = useResult();
  const { url, setUrl } = useResult();
  const { requestResult } = useRoute();
  const [step, setStep] = useState(GuideLineStep.Zero);

  const onChangeUrl = useCallback((e) => {
    const value = e.target.value;
    console.log(value);
    setUrl(value);
  });

  const linkCheck = () => {
    if (url === undefined) {
      alert("빈 값입니다. 입력창에 유튜브 주소를 입력해 주세요.");
      focusUrl();
      return;
    } else if (url !== undefined) {
      const gapCheck = url.split(" ");
      const correctLink = url.substr(0, 32);
      const backAddressCheck = url.split("=");
      if (gapCheck.length === 2) {
        alert(
          "유튜브 링크에 공백 문자가 포함되어 있습니다. 공백 문자를 제거한 주소를 입력해 주세요."
        );
        focusUrl();
        return;
      }
      if (correctLink !== "https://www.youtube.com/watch?v=") {
        alert(
          "올바른 유튜브 주소가 아닙니다. 올바른 유튜브 링크 주소를 입력해 주세요."
        );
        console.log(correctLink);
        focusUrl();
        return;
      }
      if (backAddressCheck[1].length !== 11) {
        console.log(backAddressCheck, backAddressCheck[1].length);
        alert(
          "올바른 유튜브 주소가 아닙니다. 올바른 유튜브 링크 주소를 입력해 주세요."
        );
        focusUrl();
        return;
      }
      sendUrl();
    }
  };

  function sendUrl(e) {
    if (url) {
      requestResult(url);
    }
  }

  function focusUrl() {
    if (inputValue === null) return;
    inputValue.value = "";
    urlInput.current.focus();
  }

  const onClickGuide = (type) => {
    return () => {
      setStep(type);
    };
  };

  const viewChange = () => {
    document.getElementById("guidline").scrollIntoView({ behavior: "smooth" });
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
                장면 <span className="point3">하나하나 넘기며 확인</span>하고,{" "}
                <br />
                시청자 반응은 어땠는지{" "}
                <span className="point3">채팅도 다시 체크</span>하고, <br />
                <span className="point2"> 불편하지 않았나요?</span>
              </p>
              <p className="HC1-p1">
                <span className="point1">하이라이팅(HIGHLIGHTING)</span>을
                써보세요! <br />
                방송의 <span className="point3">다시보기 링크</span>만 입력하면
                이용할 수 있습니다
              </p>
              <p className="HC1-p2">
                <span className="point2">
                  화면과 볼륨의 변화, 채팅 빈도, 키워드 출현, 후원 통계
                </span>{" "}
                등<br />
                길고 긴 방송 속에서 특별한 부분들을 찾는 기능들을 제공하고
                <br />
                <span className="point2">필요한 장면만 골라</span> 가져갈 수
                있어요
              </p>
              <p className="HC1-p3">
                {" "}
                하단 <span className="point1">가이드라인</span> 에서 사용법을
                알아보세요 :{" "}
                <span className="point2" onClick={viewChange}>
                  클릭!
                </span>
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
              <h1>
                {" "}
                <img
                  className="inputLogo"
                  src={require("./image/icon.png")}
                  onClick={linkCheck}
                />
              </h1>
              <input
                className="InputBar"
                ref={urlInput}
                placeholder="다시보기 영상 URL을 입력해주세요"
                onChange={onChangeUrl}
                id="link"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    linkCheck();
                  }
                }}
              />
              <h3> </h3>
              <button className="resultButton" onClick={linkCheck}>
                <span>분석 시작!</span>
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
              {[
                GuideLineStep.Zero,
                GuideLineStep.First,
                GuideLineStep.Second,
                GuideLineStep.Third,
              ].map((gStep) => (
                <li className="Home_list-item">
                  <div>
                    <p
                      className={classnames(
                        "Home_list-content",
                        step === gStep && "is-active"
                      )}
                      id="zero"
                      onMouseEnter={onClickGuide(gStep)}
                    >
                      {GuideLineInfoList[gStep].title}
                    </p>
                    <p
                      className={classnames(
                        "Home_list-sub",
                        step === gStep && "sub-active"
                      )}
                    >
                      {GuideLineInfoList[gStep].description}
                    </p>
                    {gStep === GuideLineStep.Third && (
                      <a className="UPscroll">
                        <br />
                        <br />
                        <br />
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
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {/* 좌하단 가이드라인 */}
          </div>
          <div className="lower_right_container">
            {/* 우하단 내용 컨테이너 */}
            <div className="Home_GuidelineContainer" id="guideContainer">
              {GuideLineStep.Zero && (
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
                        setStep(GuideLineStep.Third);
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        setStep(GuideLineStep.First);
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              )}
              {GuideLineStep.First ? (
                <div className="GuideLine_content">
                  <h2>편집점 분석</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        setStep(GuideLineStep.Zero);
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        setStep(GuideLineStep.Second);
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {GuideLineStep.Second ? (
                <div className="GuideLine_content">
                  <h2>결과 페이지</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        setStep(GuideLineStep.First);
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        setStep(GuideLineStep.Third);
                        viewChange();
                      }}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {GuideLineStep.Third ? (
                <div className="GuideLine_content">
                  <h2>북마크 기능</h2>
                  <div className="guide_content_box">
                    <p className="guide_content_p1">내용 박스</p>
                  </div>
                  <div className="guide_button_box">
                    <GiPlayButton
                      className="previousButton"
                      onClick={() => {
                        setStep(GuideLineStep.Second);
                        viewChange();
                      }}
                    />{" "}
                    <GiPlayButton
                      className="nextButton"
                      onClick={() => {
                        setStep(GuideLineStep.Zero);
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
