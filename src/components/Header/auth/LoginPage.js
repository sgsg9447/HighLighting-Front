import React, { useState } from "react";
import "./LoginPage.scss";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const loginHandler = (e) => {
    if (e.target.id === "ID") {
      setId(e.target.value);
      console.log(id);
    }
    if (e.target.id === "PASSWORD") {
      setPwd(e.target.value);
      console.log(pwd);
    }
  };

  const login = () => {
    console.log("id :", id, "pwd :", pwd);
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
          tpye="password"
          onChange={loginHandler}
        />
      </div>
      <div className="loginMid">
        <label className="autoLogin" htmlFor="hint">
          {" "}
          <input type="checkbox" id="hint" /> 로그인 유지하기
        </label>
        <div className="autoLogin">아이디/비밀번호 찾기</div>
      </div>
      <button className="loginBtn" onClick={login}>
        {" "}
        로그인{" "}
      </button>
      <div className="socialBox">
        <div className="kakao">
          <img className="kakaoLogo" src={require("./Image/kakaotalk.png")} />
          <div className="kakaoText">카카오 계정으로 신규가입</div>
        </div>
        <div className="facebook">
          <img className="facebookLogo" src={require("./Image/facebook.png")} />
          <div className="facebookText">페이스북 계정으로 신규가입</div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
