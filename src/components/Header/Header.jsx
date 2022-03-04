import "./Header.scss";
import { GiFilmProjector } from "react-icons/gi";
import { FiLogIn } from "react-icons/fi";
import { GoSignIn } from "react-icons/go";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import LoginPage from "./auth/LoginPage";
import SigninPage from "./auth/SigninPage";
import useResult from "../../hooks/useResult";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [logIn, setLogIn] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const { logged, onLogout } = useResult();
  const history = useHistory();

  useEffect(() => {
    const handleClickOutside = ({ target }) => {
      if (target.className !== "openModal modal") {
        return window.removeEventListener("click", handleClickOutside);
      }
      console.log(target.className);
      if (modalOpen && target.className === "openModal modal") {
        document.body.style.overflow = "unset";
        setModalOpen(false);
        setLogIn(false);
        setSignIn(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [modalOpen]);

  const openModal = () => {
    document.body.style.overflow = "hidden";
    setModalOpen(true);
  };
  const closeModal = () => {
    document.body.style.overflow = "unset";
    setModalOpen(false);
    setLogIn(false);
    setSignIn(false);
  };

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

  const SignInToggle = () => {
    closeModal();
    openModal();
    setSignIn(true);
  };

  return (
    <div className="navbar">
      <ul className="menu">
        <li id="Home" onClick={onClickEvent}>
          <GiFilmProjector /> HiGHLIGHTING
        </li>
        {logged ? (
          <div className="SignTool">
            <li>마이 페이지</li>
            <li onClick={onLogout}>로그아웃</li>
          </div>
        ) : (
          <div className="SignTool">
            <li
              id="SignIn"
              onClick={() => {
                openModal();
                setSignIn(true);
                console.log("SignIn 값 : ", signIn);
              }}
            >
              <GoSignIn /> 회원가입
            </li>
            <li
              id="LogIn"
              onClick={() => {
                openModal();
                setLogIn(true);
              }}
            >
              <FiLogIn /> 로그인
            </li>
          </div>
        )}
      </ul>
      {modalOpen && logIn && (
        <Modal
          // ref={modalEl}
          open={modalOpen}
          close={closeModal}
          Header="회원가입 및 로그인 "
        >
          <LoginPage setModalOpen={setModalOpen} setLogIn={setLogIn} />
          <div className="loginEnd">
            <div className="loginLine">
              회원이 아니신가요? <b onClick={SignInToggle}>회원가입</b>
            </div>
          </div>
        </Modal>
      )}
      {modalOpen && signIn && (
        <Modal
          // ref={modalEl}
          open={modalOpen}
          close={closeModal}
          Header="회원가입 및 로그인 "
        >
          <SigninPage setModalOpen={setModalOpen} setSignIn={setSignIn} />
        </Modal>
      )}
    </div>
  );
}
