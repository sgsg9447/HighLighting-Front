import "./Header.scss";
import { GiFilmProjector } from "react-icons/gi";
import { FiLogIn } from "react-icons/fi";
import { GoSignIn } from "react-icons/go";
import { useHistory } from "react-router-dom";

export default function Header() {
  const history = useHistory();

  const onClickEvent = (e) => {
    const target = e.target.id;

    if (target === "Home") {
      const result = window.confirm("홈페이지로 이동합니까?");
      if (result) {
        alert("홈페이지로 이동합니다.");
        history.push("/");
      } else {
        alert("이동을 취소합니다.");
      }
    }
  };

  return (
    <div className="navbar">
      <ul className="menu">
        <li id="Home" onClick={onClickEvent}>
          <GiFilmProjector /> HiGHLIGHTING
        </li>
        <div className="SignTool">
          <li id="SignIn" onClick={onClickEvent}>
            <GoSignIn /> 회원가입
          </li>
          <li id="LogIn" onClick={onClickEvent}>
            <FiLogIn /> 로그인
          </li>
        </div>
      </ul>
    </div>
  );
}
