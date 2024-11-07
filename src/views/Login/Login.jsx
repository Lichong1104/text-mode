import React, { useRef } from "react";
import { setToken } from "@/utils/handleToken";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import loginImg from "@/image/login.png";
import { Button, Divider, Input, message } from "antd";
import logoImage from "@/image/logo.png";

function Login() {
  const history = useHistory();

  const username = useRef(null);
  const password = useRef(null);

  // 登录
  const login = () => {
    // return message.warning("项目正在升级中，暂时无法登录！")

    const usernameValue = username.current.input.value;
    const passwordValue = password.current.input.value;

    if (!usernameValue || !passwordValue) return message.warning("请输入用户名或密码！");
    if (usernameValue !== "admin" && passwordValue !== "admin")
      return message.warning("用户名或密码错误！");

    setToken("b903bcfd233c411a8510c921b3f8fb1d");
    history.push("/");
  };

  return (
    <MainBox>
      <BackGround>
        <div></div>

        <div>
          <h1>智能文本解析平台</h1>
          <p>Get highly productive through automation and save tons of time!</p>
        </div>
        <p>© 2024 MIND-COMPUTE AI</p>
      </BackGround>
      <Action>
        <LoginBox>
          <h1>
            <img src={logoImage} alt="" />
            欢迎登录
          </h1>
          <h2>
            现在没有账号?{" "}
            <a href="/#" onClick={(e) => e.preventDefault()}>
              点击此处创建一个新账号
            </a>
          </h2>
          <h2>不到一分钟的时间即可免费注册一个全新账号！</h2>
          <Divider plain>OR</Divider>
          <Input placeholder="账户" size="large" ref={username} />
          <Input
            placeholder="密码"
            type="password"
            size="large"
            ref={password}
            onKeyUp={({ keyCode }) => (keyCode === 13 ? login() : undefined)}
          />
          <Button
            size="large"
            type="primary"
            style={{ height: "50px", fontSize: "20px", backgroundColor: "#e6618d" }}
            onClick={login}
          >
            登录
          </Button>
          <span>
            忘记密码？{" "}
            <a href="/#" onClick={(e) => e.preventDefault()}>
              点这里
            </a>
          </span>
        </LoginBox>
      </Action>
    </MainBox>
  );
}

const MainBox = styled.div`
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  > div {
    height: 100%;
  }
`;

const BackGround = styled.div`
  width: 60%;
  background-image: linear-gradient(220deg, #e6618d, rgba(46, 53, 71, 0.849)), url(${loginImg});
  background-repeat: no-repeat;
  background-size: cover;
  padding: 40px 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  img {
    height: 28px;
  }
  > p {
    color: #f5f5f5ba;
    font-size: 14px;
  }
  > div {
    color: white;
    h1 {
      font-size: 96px;
    }

    p {
      margin-top: 16px;
      font-size: 20px;
      letter-spacing: 2px;
      margin-left: 8px;
    }
  }
`;

const Action = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  max-width: 560px;
  width: 90%;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  h1 {
    font-size: 60px;
    letter-spacing: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    img {
      width: 60px;
      height: 60px;
    }
  }
  h2 {
    font-size: 16px;
    font-weight: 300;
  }
  input {
    height: 50px;
    width: 100%;
  }
  button {
    width: 100%;
    margin-top: 20px;
  }
  > span {
    font-size: 14px;
    color: #808080c3;
  }
`;

export default Login;
