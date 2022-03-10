import "./Header.scss";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { GoSignIn } from "react-icons/go";
import { HiDocumentSearch } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import LoginPage from "./auth/LoginPage";
import SigninPage from "./auth/SigninPage";
import useResult from "../../hooks/useResult";
import Guide from "./Guide";

export default function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [logIn, setLogIn] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [guide, SetGuide] = useState(false);
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
        history.push("/");
      } else {
      }
    }
  };

  const SignInToggle = () => {
    closeModal();
    openModal();
    setSignIn(true);
  };

  const handleLogout = () => {
    const result = window.confirm(
      "로그아웃 하시면 홈페이지로 이동됩니다. 로그아웃 하시겠습니까?"
    );
    if (result) {
      alert("로그아웃 되었습니다.");
      onLogout();
    } else {
    }
  };

  return (
    <div className="navbar">
      <ul className="menu">
        <li id="Home" onClick={onClickEvent}>
          <img className="Logo" src={require("./auth/Image/icon.png")} />
          HiGHLIGHTING
        </li>
        {logged ? (
          <div className="SignTool">
            <li onClick={handleLogout}>
              <FiLogOut className="purple" /> Log Out
            </li>
          </div>
        ) : (
          <div className="SignTool">
            <li
              id="Guide"
              onClick={() => {
                openModal();
                SetGuide(true);
                console.log("Guide 값 : ", guide);
              }}
            >
              <HiDocumentSearch className="purple" /> About
            </li>
            <li
              id="SignIn"
              onClick={() => {
                openModal();
                setSignIn(true);
              }}
            >
              <GoSignIn className="purple" /> Sign In
            </li>
            <li
              id="LogIn"
              onClick={() => {
                openModal();
                setLogIn(true);
              }}
            >
              <FiLogIn className="purple" /> Log In
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
      {modalOpen && guide && (
        <Modal
          // ref={modalEl}
          open={modalOpen}
          close={closeModal}
        >
          <Guide />
        </Modal>
      )}
    </div>
  );
}
