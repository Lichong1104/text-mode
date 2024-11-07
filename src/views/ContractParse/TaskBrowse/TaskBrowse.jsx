import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table, message, Drawer, Space } from "antd";
import { Button } from "@aws-amplify/ui-react";
import TaskDetailPage from "./TaskDetailPage/TaskDetailPage";
import globalColor from "@/store/color";
import { getTaskListApi } from "@/api/httpApi";
import { Tag } from "antd";

function TaskBrowse() {
  const columns = [
    { title: "编号", dataIndex: "id", algin: "center" },
    {
      title: "任务名称",
      dataIndex: "pdf_name",
      render: (v, r) => (
        <a style={{ color: globalColor.fontColor }} onClick={() => taskDetail(r)}>
          {v}
        </a>
      ),
    },
    {
      title: "模板名",
      dataIndex: "template_name",
    },
    { title: "任务创建人", dataIndex: "user_name" },
    { title: "任务创建时间", dataIndex: "create_date" },
    {
      title: (
        <span
          style={{
            letterSpacing: "14px",
          }}
        >
          状态
        </span>
      ),
      dataIndex: "review",
      align: "right",
      render: (v) => {
        if (v == 0) {
          return (
            <Tag style={{ color: "black" }} color="#ebdc07">
              未审核
            </Tag>
          );
        } else if (v == 1) {
          return <Tag color="#87d068">已审核</Tag>;
        } else if (v == 2) {
          return <Tag color="#f50">未通过</Tag>;
        }
      },
    },
  ];

  // 当前页码
  const [currentPage, setCurrentPage] = useState(1);

  const [tableData, setTableData] = useState([]);

  // 当前pdf
  const [pdfName, setPdfName] = useState("");

  // 当前模板名
  const [tempName, setTempName] = useState("");

  const [load, setLoad] = useState(false);

  // 获取任务列表
  useEffect(() => {
    const getTaskList = async () => {
      const res = await getTaskListApi(currentPage);
      if (res.code === 200) {
        if (res.data.length === 0) {
          setCurrentPage(currentPage - 1);
          return message.warning("已经是最后一页了");
        }
        const data = res.data.map((v, i) => ({ ...v, id: i + 1, key: i }));
        setTableData(data);
      }
    };
    getTaskList();
  }, [currentPage, load]);

  // 任务详情
  const taskDetail = (r) => {
    setPdfName(r.pdf_name);
    setTempName(r.template_name);
    setDrawerOpen(true);
  };

  // 抽屉
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onClose = () => setDrawerOpen(false);

  // 上一页
  const Previous = () => {
    if (currentPage <= 1) {
      return message.warning("已经是第一页了");
    }
    setCurrentPage(currentPage - 1);
  };

  // 下一页
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <MainBox>
      <BtnDiv>
        <h2>任务浏览</h2>{" "}
        <Space size="large">
          <Button
            variation="primary"
            onClick={Previous}
            size="small"
            backgroundColor={globalColor.buttonColor}
          >
            上一页
          </Button>
          <Button
            variation="primary"
            onClick={nextPage}
            size="small"
            backgroundColor={globalColor.buttonColor}
          >
            下一页
          </Button>
        </Space>
      </BtnDiv>
      <Table columns={columns} dataSource={tableData} pagination={false} bordered />
      <Drawer
        title="任务详情"
        onClose={onClose}
        placement="top"
        style={drawerStyle}
        open={drawerOpen}
      >
        <TaskDetailPage
          onChange={() => setLoad(!load)}
          page={currentPage}
          pdfName={pdfName}
          templateName={tempName}
        />
      </Drawer>
      <BtnDiv>
        <span></span>
      </BtnDiv>
    </MainBox>
  );
}

const MainBox = styled.div`
  height: 100%;
  background-color: white;
`;

const drawerStyle = {
  height: "90vh",
  width: "80vw",
  margin: "0 auto",
};

const BtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

export default TaskBrowse;
