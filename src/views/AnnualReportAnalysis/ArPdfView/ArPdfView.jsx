// UploadPage.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Empty, message, Popconfirm, Spin } from "antd";
import { deleteFileApi, getOSSListApi, uploadApi } from "@/api/ossApi";
import { Button } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ArUploadPdf = () => {
  const history = useHistory();
  // 已上传的文件
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // 选中的文件
  const [selectedPdf, setSelectedPdf] = useState(0);

  const [loading, setLoading] = useState(true);

  // 上传文件的ref
  const uploadRef = useRef(null);

  // 获取文件列表
  const getFileList = async () => {
    const res = await getOSSListApi("text-moderation/ar_upload_pdf/");
    setLoading(false);
    // 不要第一个
    setUploadedFiles(res.objects.slice(1));
  };

  useEffect(() => {
    getFileList();
  }, []);

  const upload = async (e) => {
    setLoading(true);
    const files = e.target.files;

    try {
      const newUploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadApi(file);
        if (res) {
          newUploadedFiles.push({
            name: file.name,
            url: res.url,
          });
        } else {
          message.error(`文件 ${file.name} 上传失败`);
        }
      }

      // 上传成功后重新获取文件列表
      await getFileList();
      setLoading(false);
      message.success("文件上传成功!");
    } catch (error) {
      console.error("上传出错:", error);
      setLoading(false);
      message.error("上传失败,请重试");
    }
  };

  // 删除文件
  const deleteFile = async (fileName) => {
    try {
      await deleteFileApi(fileName);
      message.success("删除成功");
      getFileList();
    } catch (err) {
      console.log(err);
      message.error("删除失败");
    }
  };

  return (
    <Spin spinning={loading} tip="正在加载" indicator={<LoadingOutlined spin />} size="large">
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
              id="file1"
              multiple
              ref={uploadRef}
              onChange={upload}
            />
          </UploadBox>

          <FileList className="myScroll">
            <h2>已上传文件</h2>
            {uploadedFiles.map((file, index) => (
              <FileItem key={index} $active={selectedPdf === index}>
                <div
                  onClick={() => setSelectedPdf(index)}
                  style={{ display: "flex", alignItems: "center", flex: 1 }}
                >
                  <i className="fas fa-file-pdf"></i>
                  <span>{file.name.split("/")[2]}</span>
                </div>
                <Popconfirm
                  title="确认删除"
                  description="确定要删除这个文件吗?"
                  onConfirm={() => deleteFile(file.name)}
                  okText="确定"
                  cancelText="取消"
                >
                  <DeleteOutlined
                    style={{ color: "#ff4d4f", cursor: "pointer" }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              </FileItem>
            ))}
          </FileList>
          <NextButton>
            <Button
              width="100%"
              variation="primary"
              size="small"
              backgroundColor={globalColor.buttonColor}
              onClick={() => {
                if (uploadedFiles.length === 0) {
                  message.warning("请先上传文件");
                  return;
                }
                setLoading(true);
                setTimeout(() => {
                  history.push("/ar_word_view");
                  setLoading(false);
                }, 3000);
                // TODO: 添加下一步的逻辑
              }}
            >
              下一步
            </Button>
          </NextButton>
        </LeftPanel>

        <RightPanel>
          {uploadedFiles.length !== 0 ? (
            <PdfPreview src={uploadedFiles[selectedPdf].url} title="PDF预览" />
          ) : (
            <NoPreview>
              <Empty />
            </NoPreview>
          )}
        </RightPanel>
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
  width: 20%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightPanel = styled.div`
  flex: 1;
  /* background: #f5f5f5; */
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

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 20px;
`;

const FileList = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  overflow-y: auto;

  h2 {
    margin-bottom: 16px;
    font-size: 16px;
  }
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
  cursor: pointer;
  border-radius: 4px;
  background: ${(props) => (props.$active ? "#e6f7ff" : "transparent")};

  &:hover {
    background: ${(props) => (props.$active ? "#e6f7ff" : "#f0f0f0")};
  }

  i {
    color: #1890ff;
  }
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
  /* color: white; */
  font-size: 16px;
`;

const NextButton = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export default ArUploadPdf;
