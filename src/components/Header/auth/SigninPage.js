import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import KakaoLogin from "react-kakao-login";
import "./SigninPage.scss";
import useResult from "../../../hooks/useResult";
import { useHistory } from "react-router-dom";
import axios from "axios";

const googleClientId =
  "901844463722-nmmshl1dpm1ejgpenpm78q8andq510hm.apps.googleusercontent.com";
const KakaoJsKey = "22cbe8edb7c41751940fa343ed0d9287";

const SigninPage = (props) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const { onLogin } = useResult();
  const history = useHistory();

  // const { server_addr } = useResult();
  const server_addr = "http://192.249.28.32:5000";

  // 통상 회원가입 핸들러.
  const SigninHandler = (e) => {
    if (e.target.id === "ID") {
      setId(e.target.value);
      console.log(id);
    }
    if (e.target.id === "PASSWORD") {
      setPassword(e.target.value);
      console.log(password);
    }
    if (e.target.id === "PASSWORDCHECK") {
      setPasswordChk(e.target.value);
      console.log(passwordChk);
    }
    if (e.target.id === "NAME") {
      setName(e.target.value);
      console.log(name);
    }
  };

  // 통상 회원가입 값 확인용
  const signInRequest = () => {
    console.log(
      "id :",
      id,
      "pwd :",
      password,
      "pwdChk :",
      passwordChk,
      "name :",
      name
    );
    axios
      .post(server_addr + "/signIn", {
        id: id,
        password: password,
        passwordChk: passwordChk,
        name: name,
      })
      .then((res) => {
        console.log("회원가입 리퀘스트");
        console.log(res.data);
        alert("회원가입에 성공하였습니다.");
        props.setModalOpen(false);
        props.setSignIn(false);
        document.body.style.overflow = "unset";
      })
      .catch((err) => {
        console.log("회원가입 리퀘스트 에러");
        console.log(err);
        alert(err);
      });
  };
  // Google Login 요청 성공했을 시
  const responseGoogle = (res) => {
    console.log("구글 response 데이터 : ", res);
    setId(res.googleId);
    setName(res.profileObj.name);
    setProvider("google");
    singInSuccess();
  };

  // Kakao Login 요청 성공했을 시
  const responseKakao = (res) => {
    console.log("카카오 response 데이터 : ", res);
    setId(res.profile.id);
    setName(res.profile.properties.nickname);
    setProvider("kakao");
    singInSuccess();
  };

  const singInSuccess = () => {
    alert("회원가입에 성공하였습니다.");
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
        <label htmlFor="NAME">이름</label>
        <br />
        <input
          className="SignInPassWord"
          id="NAME"
          placeholder="이름"
          tpye="text"
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
        <button className="SignInBtn" onClick={signInRequest}>
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
            className="KakaoLogin"
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
