import React, { useEffect, useState } from "react";
import { Table, Tag, Modal } from "antd";
import { getNotReviewTempListApi, getNotReviewTempParamsApi } from "@/api/httpApi";
import globalColor from "@/store/color";

function RejectedReview() {
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
          <Tag color="#f50" bordered>
            未通过
          </Tag>
        );
      },
    },
  ];

  const [tableData, setTableData] = useState([]);

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      const res = await getNotReviewTempListApi(2);
      if (res.code === 200) {
        const data = res.data.map((v, i) => {
          return { username: v.user_name, templateName: v.template_name, id: i + 1, key: i };
        });
        setTableData(data);
      }
    };
    fetchData();
  }, []);

  // 当前模板名
  const [currentTempName, setCurrentTempName] = useState("");

  // 字段列表
  const [tagList, setTagList] = useState([]);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = async (r) => {
    const res = await getNotReviewTempParamsApi(r.templateName, 2);
    setCurrentTempName(r.templateName);
    if (res.code === 200) setTagList(res.data);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Modal
        title={currentTempName}
        open={isModalOpen}
        okText="确定"
        cancelText="取消"
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        {tagList.map((v, i) => (
          <Tag style={{ padding: "6px 10px", fontSize: "16px" }} key={i}>
            {v}
          </Tag>
        ))}
      </Modal>
      <Table dataSource={tableData} columns={columns} bordered />
    </div>
  );
}

export default RejectedReview;
