import React from "react";
import { Layout } from "antd";

import "./Layout.scss";

import SideBar from "./SideBar/SideBar";
import BodyContent from "./BodyContent/BodyContent";
import HeaderContent from "./HeadContent/HeaderContent";

function Layouts() {
  return (
    <Layout hasSider>
      <SideBar />
      <Layout>
        <HeaderContent />
        <BodyContent />
      </Layout>
    </Layout>
  );
}

export default Layouts;
