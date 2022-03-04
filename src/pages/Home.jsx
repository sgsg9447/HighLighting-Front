import React, { useRef, useCallback } from "react";

import useResult from "../hooks/useResult";
import useRoute from "../hooks/useRoute";
import Header from "../components/Header/Header";
import "./Home.scss";

export default function Home() {
  const inputValue = document.getElementById("link");
  const urlInput = useRef();

  const { logged, onLogout } = useResult();
  const { url, setUrl } = useResult();
  const { requestResult } = useRoute();

  const onChangeUrl = useCallback((e) => {
    const value = e.target.value;
    setUrl(value);
  }, []);

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
                <span className="point2">클릭</span>
                해주세요!
              </p>
              <p className="HC1-p3">
                Creating and Providing Services :{" "}
                <span className="point1">Team HIGHLIGHTING</span>
              </p>
            </div>
            <div className="Home_introduction_heading_wrap">
              <h2> 단계별 가이드라인 </h2>
            </div>
            <ul class="Home_list">
              <li class="Home_list-item">
                <div>
                  <p class="Home_list-content">0단계</p>
                </div>
              </li>

              <li class="Home_list-item">
                <div class="Home_list-content-wrap">
                  <p class="Home_list-content">1단계</p>
                  <p class="Home_list-sub">1단계 내용</p>
                </div>
              </li>

              <li class="Home_list-item">
                <div class="Home_list-item-image"></div>
                <div class="Home_list-content-wrap">
                  <p class="Home_list-content">2단계</p>
                  <p class="Home_list-sub">2단계 내용</p>
                </div>
              </li>

              <li class="Home_list-item">
                <div class="Home_list-content-wrap">
                  <p class="Home_list-content">3단계</p>
                  <p class="Home_list-sub">3단계 내용</p>
                </div>
              </li>

              <li class="Home_list-item">
                <div class="Home_list-content-wrap">
                  <p class="Home_list-content">4단계</p>
                  <p class="Home_list-sub">4단계 내용</p>
                </div>
              </li>

              <li class="Home_list-item">
                <div class="Home_list-item-image"></div>
                <div class="Home_list-content-wrap">
                  <p class="Home_list-content">5단계</p>
                  <p class="Home_list-sub">5단계 내용</p>
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
            <div class="Home_GuidelineContainer">단계별 가이드라인 파트</div>
          </div>
        </div>
      </div>
    </div>
  );
}
