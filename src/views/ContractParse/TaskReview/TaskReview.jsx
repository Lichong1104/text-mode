import React from "react";
import { Tabs, ConfigProvider } from "antd";
import TaskReviewCom from "./TaskReviewCom";
import TempReviewCom from "./TempReviewCom";
import RejectedReview from "./RejectedReview";
import globalColor from "@/store/color";
import { EyeOutlined, FileExcelOutlined, FileMarkdownOutlined } from "@ant-design/icons";

const TaskReview = () => {
  const tabItems = [
    {
      label: `任务审核`,
      key: 1,
      children: <TaskReviewCom />,
      icon: <EyeOutlined />,
    },
    {
      label: `模板审核`,
      key: 2,
      children: <TempReviewCom />,
      icon: <FileMarkdownOutlined />,
    },
    {
      label: `被拒审核`,
      key: 3,
      children: <RejectedReview />,
      icon: <FileExcelOutlined />,
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
      <Tabs size="large" type="card" items={tabItems} />;
    </ConfigProvider>
  );
};
export default TaskReview;
