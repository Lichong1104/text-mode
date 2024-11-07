import React, { useEffect } from "react";
import { Tabs, ConfigProvider } from "antd";

import globalColor from "@/store/color";
import { UploadOutlined, FileMarkdownOutlined } from "@ant-design/icons";
import MultipleDocUpload from "./MultipleDocUpload/MultipleDocUpload";
import DocPreview from "./DocPreview/DocPreview";
import { useDispatch } from "react-redux";

const MultiDocumentReview = () => {
  // 收缩侧边栏
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "COLLAPSED/TRUE" });
    return () => {
      dispatch({ type: "COLLAPSED/FALSE" });
    };
  }, []);
  const tabItems = [
    {
      label: `文档上传`,
      key: 1,
      children: <MultipleDocUpload />,
      icon: <UploadOutlined />,
    },
    {
      label: `解析结果`,
      key: 2,
      children: <DocPreview />,
      icon: <FileMarkdownOutlined />,
    },
  ];
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemActiveColor: globalColor.fontColor,
            itemSelectedColor: globalColor.fontColor,
            itemHoverColor: globalColor.fontColor,
          },
        },
      }}
    >
      <Tabs size="large" type="card" items={tabItems} />
    </ConfigProvider>
  );
};
export default MultiDocumentReview;
