import React from "react";
import { sideBarList } from "@/layouts/SideBar/sideBarData";
import styled from "styled-components";
import { useLocation, useHistory } from "react-router-dom";
import globalColor from "@/store/color";

function Breadcrumb() {
  const location = useLocation();
  const history = useHistory();

  // 去除当前路由的key
  const findMenuItem = (items, path) => {
    for (let item of items) {
      if (item.key === path) {
        return item;
      }
      if (item.children) {
        const found = findMenuItem(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <BreadcrumbBox>
      <Home onClick={() => history.push("/contract_parse/task_browse")}>主页</Home>
      {" / "}
      {findMenuItem(sideBarList, location.pathname)?.label}
    </BreadcrumbBox>
  );
}

const BreadcrumbBox = styled.div`
  font-size: 16px;
  color: #333;
`;

const Home = styled.a`
  color: ${globalColor.fontColor};
  cursor: pointer;
  transition: none;
  &:hover {
    color: ${globalColor.fontColor};
    text-decoration: underline;
  }
`;

export default Breadcrumb;
