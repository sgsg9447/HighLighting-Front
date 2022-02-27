import React from "react";

// const [id, setId] = useState("");
// const [pwd, setPwd] = useState("");

const LoginPage = () => {
  return (
    <div>
      로그인 페이지
      <div>
        <label for="ID">ID</label>
        <br />
        <input id="ID" />
      </div>
      <div>
        <label for="PASSWORD">PASSWORD</label>
        <br />
        <input id="PASSWORD" />
      </div>
      <button>회원 가입</button>
      <button>로그인</button>
      <br />
      <button>Ouath 로그인 1번</button>
      <br />
      <button>Ouath 로그인 2번</button>
    </div>
  );
};

export default LoginPage;
