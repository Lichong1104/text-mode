import React from "react";
import { Dropdown, Layout } from "antd";
import { useHistory } from "react-router-dom";
import { removeToken } from "@/utils/handleToken";
import NProgress from "nprogress";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const { Header } = Layout;

function HeaderContent() {
  const history = useHistory();

  const logout = () => {
    removeToken();

    Jump("/login");
  };
  //带进度跳转
  const Jump = (url) => {
    NProgress.start();
    setTimeout(() => {
      NProgress.done();
      history.push(url);
    }, 1000);
  };

  const userInfoList = {
    items: [
      {
        key: "1",
        danger: true,
        label: <span onClick={logout}>退出登录</span>,
      },
    ],
  };

  return (
    <Header
      style={{
        backgroundColor: "white",
        padding: "0 36px",
        height: "80px",
      }}
    >
      <div className="headerBox">
        <Breadcrumb />
        <Dropdown menu={userInfoList} placement="bottom">
          <div className="userInfo">
            <img
              src="https://tse4-mm.cn.bing.net/th/id/OIP-C.YO2qlIyNCImsl9igP6jFjwHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}

export default HeaderContent;
