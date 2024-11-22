import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Empty, message, Select, Input, Button as AntButton, Spin, Modal } from "antd";
import ReactMarkdown from "react-markdown";

import { Button } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";
import { LoadingOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const SmartTrainingAssistant = () => {
  const [loading, setLoading] = useState(false);
  const uploadRef = useRef(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  axios.defaults.baseURL = "http://3.19.69.227:8002";

  // 解析参数相关状态
  const [params, setParams] = useState([
    {
      question_type: "判断题",
      topic: "",
      number: 1,
    },
  ]);

  // 题目类型选项
  const questionTypes = ["判断题", "问答题", "选择题"];

  // 处理上传
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.file_url) {
        setCurrentPdfUrl(response.data.file_url);
        setCurrentFileName(file.name);
        message.success("文件上传成功！");
      }
    } catch (error) {
      console.error("上传失败:", error);
      message.error("文件上传失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 处理解析
  const handleAnalyze = async () => {
    if (!currentFileName) {
      message.warning("请先上传PDF文件");
      return;
    }

    if (params.some((param) => !param.topic)) {
      message.warning("请填写所有主题");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/create_exam_api/${currentFileName}`, params);

      if (response.data) {
        message.success("解析成功！");
        setDownloadFileName(response.data.filename);
        setMarkdownText(response.data.markdown_text);
      }
    } catch (error) {
      console.error("解析失败:", error);
      message.error("解析失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 处理下载
  const handleDownload = async () => {
    if (!downloadFileName) {
      message.warning("请先完成解析");
      return;
    }

    try {
      const response = await axios.get(`/download/${downloadFileName.split("/")[1]}`, {
        responseType: "blob",
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadFileName.split("/")[1]);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下载失败:", error);
      message.error("下载失败，请重试");
    }
  };

  // 添加参数
  const addParam = () => {
    setParams([
      ...params,
      {
        question_type: "判断题",
        topic: "",
        number: 1,
      },
    ]);
  };

  // 删除参数
  const removeParam = (index) => {
    const newParams = params.filter((_, idx) => idx !== index);
    setParams(newParams);
  };

  // 更新参数
  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  return (
    <Spin spinning={loading} tip="正在加载" size="large" indicator={<LoadingOutlined spin />}>
      <Container>
        <LeftPanel>
          <UploadBox>
            <Button
              width="100%"
              variation="primary"
              onClick={() => uploadRef.current.click()}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              上传文件
            </Button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={uploadRef}
              onChange={upload}
              accept=".pdf"
            />
          </UploadBox>

          <ParamsContainer className="myScroll">
            <ParamsHeader>
              <h2>解析题型</h2>
              <AntButton type="link" icon={<PlusOutlined />} onClick={addParam}>
                添加题型
              </AntButton>
            </ParamsHeader>

            {params.map((param, index) => (
              <ParamItem key={index}>
                <Select
                  style={{ width: "100%" }}
                  value={param.question_type}
                  onChange={(value) => updateParam(index, "question_type", value)}
                  options={questionTypes.map((type) => ({ label: type, value: type }))}
                />
                <Input
                  placeholder="请输入主题"
                  value={param.topic}
                  onChange={(e) => updateParam(index, "topic", e.target.value)}
                />
                <Select
                  style={{ width: "100%" }}
                  value={param.number}
                  onChange={(value) => updateParam(index, "number", value)}
                  options={Array.from({ length: 10 }, (_, i) => ({ label: i + 1, value: i + 1 }))}
                />
                {index !== 0 && (
                  <MinusCircleOutlined
                    onClick={() => removeParam(index)}
                    style={{ color: "#ff4d4f", cursor: "pointer" }}
                  />
                )}
              </ParamItem>
            ))}
          </ParamsContainer>

          <AnalyzeButtonGroup>
            <Button
              width="30%"
              variation="primary"
              size="small"
              backgroundColor={globalColor.buttonColor}
              onClick={handleAnalyze}
            >
              生成
            </Button>
            <Button
              width="30%"
              variation="primary"
              size="small"
              backgroundColor={globalColor.buttonColor}
              onClick={() => setPreviewVisible(true)}
              disabled={!markdownText}
            >
              预览
            </Button>
            <Button
              width="30%"
              variation="primary"
              size="small"
              backgroundColor={globalColor.buttonColor}
              onClick={handleDownload}
              disabled={!downloadFileName}
            >
              下载
            </Button>
          </AnalyzeButtonGroup>
        </LeftPanel>

        <RightPanel>
          {currentPdfUrl ? (
            <PdfPreview src={currentPdfUrl} title="PDF预览" />
          ) : (
            <NoPreview>
              <Empty description="暂无PDF预览" />
            </NoPreview>
          )}
        </RightPanel>

        <Modal
          title="预览解析结果"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={800}
        >
          <MarkdownContainer className="myScroll">
            {/* <ReactMarkdown>{markdownText}</ReactMarkdown> */}
            <pre style={{ whiteSpace: "pre-wrap" }}>{markdownText}</pre>
          </MarkdownContainer>
        </Modal>
      </Container>
    </Spin>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100%;
  gap: 20px;
`;

const LeftPanel = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightPanel = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UploadBox = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ParamsContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-y: auto;
`;

const ParamsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 16px;
  }
`;

const ParamItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 12px;
  position: relative;

  .anticon-minus-circle {
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const AnalyzeButtonGroup = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const PdfPreview = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
`;

const NoPreview = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MarkdownContainer = styled.div`
  font-size: 14px;
  line-height: 1.6;
  height: 60vh;
  overflow-y: auto;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 24px;
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 16px;
  }

  code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 4px;
  }

  pre {
    background-color: #f5f5f5;
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
  }

  ul,
  ol {
    padding-left: 20px;
    margin-bottom: 16px;
  }
`;

export default SmartTrainingAssistant;
