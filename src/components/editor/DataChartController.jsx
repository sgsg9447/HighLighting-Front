import React from "react";

import useResult from "../../hooks/useResult";
import "./DataChartController.scss";

function DataChartController({ url, duration }) {

  const { isChatKeywords } = useResult();


  return (
    <>
      <div className="container__chat">
        <h2>{isChatKeywords ? "채팅 빈도" : "키워드 감지"}</h2>
        <h3>
          {isChatKeywords
            ? "높을수록 시청자 반응이 좋은 장면이에요"
            : "검색한 키워드가 얼마나 등장했는지 보여줘요"}
        </h3>
      </div>
      <div className="container__video">
        <h2>화면 변화</h2>
        <h3>뾰족한 부분이 장면이 바뀌는 순간이에요</h3>
      </div>
      <div className="container__audio">
        <h2>오디오 볼륨</h2>
        <h3>두꺼우면 시끄럽고, 얇으면 조용한 장면이에요</h3>
      </div>
    </>
  );
}

export default DataChartController;
