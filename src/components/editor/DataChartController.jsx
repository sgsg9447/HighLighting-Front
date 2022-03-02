import "./DataChartController.scss";

function DataChartController({ url, duration }) {

  return (
    <>
      <div className="container__chat">
        <h2>채팅</h2>
      </div>
      <div className="container__video">
        <h2>화면 변화</h2>
      </div>
      <div className="container__audio">
        <h2>오디오</h2>
      </div>
    </>
  );
}

export default DataChartController;