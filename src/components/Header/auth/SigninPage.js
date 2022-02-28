import React, { useState } from "react";
import "./SigninPage.scss";

const SigninPage = () => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");

  const loginHandler = (e) => {
    if (e.target.id === "ID") {
      setId(e.target.value);
      console.log(id);
    }
    if (e.target.id === "PASSWORD") {
      setPwd(e.target.value);
      console.log(pwd);
    }
    if (e.target.id === "PASSWORDCHECK") {
      setPwdChk(e.target.value);
      console.log(pwdChk);
    }
  };

  const login = () => {
    console.log("id :", id, "pwd :", pwd, "pwdChk :", pwdChk);
  };

  return (
    <div className="LoginContainer">
      <div>
        <label id="ID" htmlFor="ID">
          ID
        </label>
        <br />
        <input
          id="ID"
          className="loginID"
          placeholder="아이디"
          type="text"
          onChange={loginHandler}
        />
      </div>
      <div>
        <label htmlFor="PASSWORD">PASSWORD</label>
        <br />
        <input
          className="loginPassWord"
          id="PASSWORD"
          placeholder="비밀번호"
          type="password"
          onChange={loginHandler}
        />
      </div>
      <div>
        <label htmlFor="PASSWORDCHECK">PASSWORDCHECK</label>
        <br />
        <input
          className="loginPassWord"
          id="PASSWORDCHECK"
          placeholder="비밀번호 확인"
          type="password"
          onChange={loginHandler}
        />
      </div>
      <div className="loginBtnContainer">
        <button className="loginBtn" onClick={login}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SigninPage;
