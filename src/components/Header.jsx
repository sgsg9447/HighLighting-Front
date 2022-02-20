export default function Header() {
  const styleHeader = {
    backgroundColor: "black",
    color: "aqua",
    fontSize: 24,
    padding: "1rem",
  };

  return (
    <header>
      <div className="header__container" style={styleHeader}>
        <div className="title">헤더</div>
        <div className="flex__box">
          <div className="subtitle">홈버튼 박스</div>
        </div>
      </div>
    </header>
  );
}
