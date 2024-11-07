import React, { useEffect, useState } from "react";
import { Table, Modal, Tag, Space, message } from "antd";
import { getNotReviewTempListApi, getNotReviewTempParamsApi, reviewTempApi } from "@/api/httpApi";
import globalColor from "@/store/color";
import { Button } from "@aws-amplify/ui-react";

function TempReviewCom() {
  const columns = [
    { title: "编号", dataIndex: "id", algin: "center" },
    {
      title: "模板名",
      dataIndex: "templateName",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "字段",
      dataIndex: "view",
      render: (v, r) => (
        <a style={{ color: globalColor.fontColor }} onClick={() => showModal(r)}>
          查看字段
        </a>
      ),
    },
    {
      title: "状态",
      dataIndex: "review",
      render: () => {
        return (
          <Tag style={{ color: "black" }} color="#ebdc07" bordered>
            未审核
          </Tag>
        );
      },
    },
  ];

  const [tableData, setTableData] = useState([]);

  // 加载
  const [load, setLoad] = useState(false);

  // 获取未审核人物列表
  useEffect(() => {
    const fetchData = async () => {
      const res = await getNotReviewTempListApi(0);
      if (res.code === 200) {
        const data = res.data.map((v, i) => {
          return { username: v.user_name, templateName: v.template_name, id: i + 1, key: i };
        });
        setTableData(data);
      }
    };
    fetchData();
  }, [load]);

  // 字段列表
  const [tagList, setTagList] = useState([]);

  // 当前模板名
  const [currentTempName, setCurrentTempName] = useState("");

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = async (r) => {
    const res = await getNotReviewTempParamsApi(r.templateName, 0);
    setCurrentTempName(r.templateName);
    if (res.code === 200) setTagList(res.data);
    setIsModalOpen(true);
  };

  // 拒绝
  const rejected = async () => {
    const res = await reviewTempApi(currentTempName, 2);
    if (res.code === 200) message.success("拒绝成功");
    setIsModalOpen(false);
    setLoad(!load);
  };

  // 通过
  const pass = async () => {
    const res = await reviewTempApi(currentTempName, 1);
    if (res.code === 200) message.success("通过成功");
    setIsModalOpen(false);
    setLoad(!load);
  };

  return (
    <div>
      <Modal
        title={currentTempName}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Space size="middle">
            <Button
              size="small"
              onClick={pass}
              variation="primary"
              backgroundColor={globalColor.buttonColor}
            >
              通过
            </Button>
            <Button
              onClick={rejected}
              size="small"
              variation="primary"
              backgroundColor={globalColor.buttonColor}
            >
              拒绝
            </Button>
          </Space>,
        ]}
      >
        {tagList.map((v, i) => (
          <Tag style={{ padding: "6px 10px", fontSize: "16px", marginTop: "8px" }} key={i}>
            {v}
          </Tag>
        ))}
      </Modal>
      <Table dataSource={tableData} columns={columns} bordered />
    </div>
  );
}

export default TempReviewCom;
