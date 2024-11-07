import React, { useEffect, useState } from "react";
import { message, Table, Modal, Tag, Space } from "antd";
import {
  changeTaskStatusApi,
  getNotReviewTaskDetailApi,
  getNotReviewTaskListApi,
  getTaskDetailApi,
} from "@/api/httpApi";
import globalColor from "@/store/color";
import ContractTable from "../CreateTemplate/ContractTable/ContractTable";
import { Button } from "@aws-amplify/ui-react";

function TaskReviewCom() {
  // 获取未审核人物列表
  const columns = [
    { title: "编号", dataIndex: "id" },
    {
      title: "任务名称",
      dataIndex: "pdf_name",
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
    { title: "任务创建人", dataIndex: "user_name" },
    { title: "任务创建时间", dataIndex: "create_date" },
    {
      title: "状态",
      dataIndex: "review",
      render: (v) => {
        return (
          <Tag style={{ color: "black" }} color="#ebdc07">
            未审核
          </Tag>
        );
      },
    },
  ];

  const [tableData, setTableData] = useState([]);

  const [load, setLoad] = useState(false);

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      const res = await getNotReviewTaskListApi(1);
      if (res.code === 200) {
        setTableData(res.data.map((v, i) => ({ ...v, id: i + 1, key: i })));
      }
    };
    fetchData();
  }, [load]);

  // 当前模板名
  const [currentTempName, setCurrentTempName] = useState("");

  // 页码
  const [currentPage, setCurrentPage] = useState(1);

  // 合同数据
  const [contractTableData, setContractTableData] = useState([]);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = async (r) => {
    setIsModalOpen(true);
    const res = await getNotReviewTaskDetailApi(r.pdf_name);
    setCurrentTempName(r.pdf_name);
    console.log(res.data);
    if (res.code === 200) {
      setContractTableData(res.data[0].template_info);
    }
  };

  // 拒绝
  const rejected = async () => {
    const res = await changeTaskStatusApi(currentTempName, 2);
    if (res.code === 200) message.success("拒绝成功");
    setIsModalOpen(false);
    setLoad(!load);
  };

  // 通过
  const pass = async () => {
    const res = await changeTaskStatusApi(currentTempName, 1);
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
        <ContractTable tableData={contractTableData} />
      </Modal>
      <Table columns={columns} dataSource={tableData} pagination={false} bordered />
    </div>
  );
}

export default TaskReviewCom;
