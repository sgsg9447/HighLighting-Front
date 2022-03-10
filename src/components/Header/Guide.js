import React from "react";
import "./Guide.scss";

const Guide = () => {
  return (
    <div>
      <h1 className="HC1_heading">
        <img className="HC1-logo" src={require("../../pages/image/icon.png")} />
        HIGHLIGHTING
      </h1>
      <p className="HC1-p1">
        장면을 하나하나 넘기며 확인하고, 시청자 반응은 어땠는지 채팅도 다시 체크
        하고 혹시 불편하지 않으셨나요?
      </p>
      <p className="HC1-p1">
        저희 웹서비스 <span className="point2">하이라이팅(HIGHLIGHTING)</span>을
        써보세요! 방송의 다시보기 링크만 입력하면 이용할 수 있습니다
      </p>
      <p className="HC1-p2">
        화면의 변화, 채팅 빈도, 키워드 출현 빈도, 후원 통계 등 길고 긴 방송
        속에서 특별한 부분들을 찾는 기능들을 제공하고 필요한 장면만 골라 가져갈
        수 있어요
      </p>
      <p className="HC1-p3">
        {" "}
        홈페이지 하단 <span className="point1">가이드라인</span> 에서 단계별
        사용법을 알아보세요 !
      </p>
    </div>
  );
};

export default Guide;
