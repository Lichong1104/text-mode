import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Empty, message, Spin } from "antd";
import { Button } from "@aws-amplify/ui-react";
import { LoadingOutlined } from "@ant-design/icons";
import globalColor from "@/store/color";
import { useHistory } from "react-router-dom";

const ArWordView = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const uploadRef = useRef(null);

  const [loadingText, setLoadingText] = useState("正在上传...");

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    setLoading(true);

    setTimeout(() => {
      setPreviewUrl(
        "https://fquantplus.oss-cn-qingdao.aliyuncs.com/text-moderation/ar_upload_word/%E4%B8%AD%E5%9B%BD%E5%A4%AA%E5%B9%B3%E6%B4%8B%E4%BF%9D%E9%99%A9%EF%BC%88%E9%9B%86%E5%9B%A2%EF%BC%89%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B82023%E5%B9%B4%E6%8A%A5%E5%88%86%E6%9E%90-%E6%A8%A1%E6%9D%BF.pdf"
      );
      setLoading(false);
    }, 5000);

    setSelectedFile(file);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      message.warning("请先上传文件!");
      return;
    }

    setLoading(true);
    // 休眠函数
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // 更新加载文本
    setLoadingText("正在提取股东信息...");
    await sleep(5000);
    setLoadingText("正在提取高管信息...");
    await sleep(3000);
    setLoadingText("正在提取财务数据...");
    await sleep(5000);
    setLoadingText("正在生成财务分析...");
    await sleep(5000);
    setLoadingText("正在生成报告...");
    await sleep(2000);

    setLoading(false);
    message.success("文件处理成功！");
    setPreviewUrl(
      "https://fquantplus.oss-cn-qingdao.aliyuncs.com/text-moderation/ar_upload_word/%E4%B8%AD%E5%9B%BD%E5%A4%AA%E5%B9%B3%E6%B4%8B%E4%BF%9D%E9%99%A9%EF%BC%88%E9%9B%86%E5%9B%A2%EF%BC%89%E8%82%A1%E4%BB%BD%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B82023%E5%B9%B4%E6%8A%A5%E5%88%86%E6%9E%90.pdf"
    );
  };

  return (
    <Spin spinning={loading} tip={loadingText} indicator={<LoadingOutlined spin />} size="large">
      <Container>
        <PreviewPanel>
          {previewUrl ? (
            <PdfPreview src={previewUrl} title="PDF预览" />
          ) : (
            <NoPreview>
              <Empty description={selectedFile ? "点击开始处理按钮开始转换" : "请上传文件"} />
            </NoPreview>
          )}
        </PreviewPanel>

        <ButtonContainer>
          <Button
            variation="primary"
            onClick={() => history.push("/ar_pdf_view")}
            size="small"
            backgroundColor={globalColor.buttonColor}
          >
            上一步
          </Button>
          <RightButtons>
            <Button
              variation="primary"
              onClick={() => uploadRef.current.click()}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              上传文件
            </Button>
            <Button
              variation="primary"
              onClick={handleProcess}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              开始处理
            </Button>
          </RightButtons>
          <input type="file" style={{ display: "none" }} ref={uploadRef} onChange={handleUpload} />
        </ButtonContainer>

        {/* {selectedFile && (
          <FileInfo>
            <i className="fas fa-file-word" style={{ marginRight: "8px" }}></i>
            <span>{selectedFile.name}</span>
          </FileInfo>
        )} */}
      </Container>
    </Spin>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
`;

const PreviewPanel = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const RightButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  word-break: break-all;
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
  color: #999;
  font-size: 16px;
`;

export default ArWordView;
