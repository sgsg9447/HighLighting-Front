import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import KakaoLogin from "react-kakao-login";
import "./SigninPage.scss";
import useResult from "../../../hooks/useResult";
import { useHistory } from "react-router-dom";

const googleClientId =
  "901844463722-nmmshl1dpm1ejgpenpm78q8andq510hm.apps.googleusercontent.com";
const KakaoJsKey = "22cbe8edb7c41751940fa343ed0d9287";

const SigninPage = (props) => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const { onLogin } = useResult();
  const history = useHistory();

  // 통상 회원가입 핸들러.
  const SigninHandler = (e) => {
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

  // 통상 회원가입 값 확인용
  const login = () => {
    console.log("id :", id, "pwd :", pwd, "pwdChk :", pwdChk);
  };

  // Google Login 요청 성공했을 시
  const responseGoogle = (res) => {
    console.log("구글 response 데이터 : ", res);
    setId(res.googleId);
    setName(res.profileObj.name);
    setProvider("google");
    loginSuccess();
  };

  // Kakao Login 요청 성공했을 시
  const responseKakao = (res) => {
    console.log("카카오 response 데이터 : ", res);
    setId(res.profile.id);
    setName(res.profile.properties.nickname);
    setProvider("kakao");
    loginSuccess();
  };

  const loginSuccess = () => {
    console.log(props);
    props.setModalOpen(false);
    props.setSignIn(false);
    onLogin();
    history.push("/");
  };

  // 요청 실패했을 시
  const responseFail = (err) => {
    console.log("회원가입 에러 : ", err);
  };

  // Hook 에러 방지겸 값 화인용 구문
  if (name !== "" && id !== "" && provider !== "")
    console.log("id :", id, "name :", name, "provider :", provider);

  // 카카오톡 버튼 인라인 style
  const KakaoButton = {
    width: "370px",
    height: "45px",
    justifyContent: "center",
    marginBottom: "12px",
    color: "#783c0",
    backgroundColor: "#f8df02",
    border: "1px solid transparent",
  };

  useEffect(() => {
    const tempKakao = document.querySelector("#kakaotalk > button");
    tempKakao.innerHTML = "카카오톡으로 회원가입";
    const tempGoogle = document.querySelector("#google>button>span");
    tempGoogle.innerHTML = "Google로 회원가입";
  }, []);

  return (
    <div className="SignInContainer">
      <div>
        <label htmlFor="ID">ID</label>
        <br />
        <input
          id="ID"
          className="SignInID"
          placeholder="아이디"
          type="text"
          onChange={SigninHandler}
        />
      </div>
      <div>
        <label htmlFor="PASSWORD">PASSWORD</label>
        <br />
        <input
          className="SignInPassWord"
          id="PASSWORD"
          placeholder="비밀번호"
          type="password"
          onChange={SigninHandler}
        />
      </div>
      <div>
        <label htmlFor="PASSWORDCHECK">PASSWORDCHECK</label>
        <br />
        <input
          className="SignInPassWord"
          id="PASSWORDCHECK"
          placeholder="비밀번호 확인"
          type="password"
          onChange={SigninHandler}
        />
      </div>
      <div className="SignInBtnContainer">
        <button className="SignInBtn" onClick={login}>
          회원가입
        </button>
        <br />
        <div id="google">
          <GoogleLogin
            clientId={googleClientId}
            buttonText="Google"
            onSuccess={responseGoogle}
            onFailure={responseFail}
            className="googleButton"
          />
        </div>
        <br />
        <div id="kakaotalk">
          <KakaoLogin
            class="kakads"
            style={KakaoButton}
            jsKey={KakaoJsKey}
            buttonText="Kakao"
            onSuccess={responseKakao}
            onFailure={responseFail}
            getProfile="true"
            id="kakaobutton"
          />
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
