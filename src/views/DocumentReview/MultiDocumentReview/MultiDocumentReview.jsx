import { Button } from "@aws-amplify/ui-react";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import globalColor from "@/store/color";
import { Drawer, Form, Input, Modal, Select, Table, Tag, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { clearDocxApi, getExcelParamsApi, ruleCheckApi } from "@/api/httpApi";

function MultiDocumentReview() {
  // 新建项目
  const createProject = () => setIsModalOpen(true);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [excelName, setExcelName] = useState("");

  // 上传excel
  const uploadExcel = async (e) => {
    const file = e.target.files[0];
    if (file.name.split(".").pop() !== "xlsx") return message.error("请上传xlsx文件！");

    const formData = new FormData();
    formData.append("file", file);

    const params = {
      method: "post",
      url: "http://116.204.67.82:8893/upload/excel",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios(params);
    console.log(res);
    if (res.data.code !== 200) return message.error("上传失败");
    message.success("上传成功！");
    setExcelName(file.name.split(".").shift());
  };

  const excelRef = React.useRef(null);

  // excel字段
  const [excelFields, setExcelFields] = useState([]);

  const [projectNameList, setProjectNameList] = useState([]);

  const [projectSelected, setProjectSelected] = useState("");

  const [childrenList, setChildrenList] = useState([]);

  const [childrenSelected, setChildrenSelected] = useState([]);

  const loadTagList = async () => {
    await clearDocxApi();
    const res = await getExcelParamsApi(excelName);
    if (res.code !== 200) return message.error("获取字段失败！");
    console.log(res.data);
    setProjectNameList(
      res.data.map((v, i) => {
        return {
          label: v.要项名称,
          value: i,
          key: v.key,
        };
      })
    );
    setProjectSelected(res.data[0].要项名称);
    setExcelFields(res.data);
    setChildrenList(res.data[0].内容.map((v) => ({ label: v, value: v })));
  };

  const multiFileRef = useRef(null);

  const multiFileUpload = async (e) => {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);

        const params = {
          method: "post",
          url: "http://116.204.67.82:8893/upload/docx",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const res = await axios(params);
        message.success(`文件${file.name}上传成功`);
        // 在这里可以处理上传成功的操作
      } catch (error) {
        message.error(`文件 ${file.name} 上传失败:`);
        // 在这里可以处理上传失败的操作
      }
    }
  };

  // 字段改变
  const fieldsChange = (v, r) => {
    setProjectSelected(v);
    const filterObj = excelFields.find((v) => v.key === r.key);
    console.log(filterObj);
    setChildrenList(filterObj.内容.map((v) => ({ label: v, value: v })));
  };

  // 每次重新选择children字段
  useEffect(() => {
    setChildrenSelected(childrenList[0]);
  }, [childrenList]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const onClose = () => setDrawerOpen(false);

  const drawerStyle = {
    height: "90vh",
    width: "80vw",
    margin: "0 auto",
  };

  const columns = [
    {
      title: "要项名称",
      dataIndex: "要项名称",
      width: 300,
    },
    {
      title: "结果",
      dataIndex: "结果",
      ellipsis: true,
    },
  ];

  const [tableData, setTableData] = useState([]);

  const [tableLoading, setTableLoading] = useState(false);

  const loadTable = async () => {
    setDrawerOpen(true);
    setTableLoading(true);
    const res = await ruleCheckApi().catch(() => {
      setTableLoading(false);
      message.error("获取数据失败！");
    });
    console.log(res);
    if (res.code !== 200) {
      setTableLoading(false);
      return message.error(JSON.stringify(res.data));
    }
    setTableData(res.data);
    setTableLoading(false);
  };

  return (
    <div>
      <Header>
        <Button
          variation="primary"
          onClick={createProject}
          size="small"
          backgroundColor={globalColor.buttonColor}
        >
          新建项目
        </Button>
        <Modal
          title="新建项目"
          open={isModalOpen}
          footer={[]}
          onOk={handleOk}
          width={"800px"}
          onCancel={handleCancel}
        >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="项目名称"
              name="projectName"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="上传" valuePropName="fileList" getValueFromEvent={normFile}>
              <input
                type="file"
                ref={excelRef}
                style={{ display: "none" }}
                onChange={uploadExcel}
              />
              <UploadBox onClick={() => excelRef.current.click()}>
                <button
                  style={{
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </button>
              </UploadBox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                variation="primary"
                onClick={() => {
                  if (excelName === "") return message.error("请上传文件！");
                  setIsModalOpen(false);
                  setIsModalOpen2(true);
                  loadTagList();
                }}
                size="small"
                backgroundColor={globalColor.buttonColor}
              >
                下一步
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="新建项目"
          open={isModalOpen2}
          footer={[]}
          onOk={handleOk2}
          width={"800px"}
          onCancel={handleCancel2}
        >
          <input
            type="file"
            ref={multiFileRef}
            multiple
            style={{ display: "none" }}
            onChange={multiFileUpload}
          />
          <Select
            value={projectSelected}
            style={{
              width: "100%",
            }}
            onChange={fieldsChange}
            options={projectNameList}
          />
          <br />
          <br />
          <Select
            value={childrenSelected}
            style={{
              width: "100%",
            }}
            onChange={(v) => {
              setChildrenSelected(v);
            }}
            mode="multiple"
            options={childrenList}
          />{" "}
          <br />
          <br />
          <UploadBox onClick={() => multiFileRef.current.click()}>
            <button
              style={{
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                请按照以上字段上传文件
              </div>
            </button>
          </UploadBox>
          <br />
          <Drawer
            title="任务详情"
            onClose={onClose}
            placement="top"
            style={drawerStyle}
            open={drawerOpen}
          >
            <Table bordered loading={tableLoading} columns={columns} dataSource={tableData} />
          </Drawer>
          <Button
            variation="primary"
            onClick={() => {
              if (multiFileRef.current.files.length === 0) return message.error("请上传文件！");
              loadTable();
            }}
            size="small"
            backgroundColor={globalColor.buttonColor}
          >
            下一步
          </Button>
        </Modal>
      </Header>
    </div>
  );
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
`;

const UploadBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  border: 1px dashed #cbc9c9;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
`;

export default MultiDocumentReview;
