import { parseMarkdownApi, uploadPdfApi } from "@/pdfApi/httpApi";
import globalColor from "@/store/color";
import {
  ArrowUpOutlined,
  FileDoneOutlined,
  FolderOpenOutlined,
  FundOutlined,
  HeatMapOutlined,
  LoadingOutlined,
  PlusSquareOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Space, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import styled from "styled-components";

function UploadPdf() {
  const dispatch = useDispatch();

  // 上传
  const fileInput = useRef(null);
  const folderInput = useRef(null);

  const [loading, setLoading] = useState(false);

  const [loadingText, setLoadingText] = useState("");

  // 文件上传
  const fileUpload = async (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files).map((f, i) => ({
      name: f.name,
      size: f.size,
      status: "wait",
      key: Date.now() + i,
    }));
    dispatch({
      type: "IS_UPLOAD/CHANGE",
      payload: true,
    });
    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      setLoadingText(`正在上传第${i + 1}个文件`);

      const uploadRes = await uploadPdfApi(formData).catch(() => {
        message.error("文件上传失败");
        return setLoading(false);
      });
      if (uploadRes.code !== 200) {
        message.error(uploadRes.message);
        return setLoading(false);
      }

      setLoadingText(`正在解析第${i + 1}个文件`);
      const parseRes = await parseMarkdownApi(uploadRes.data.p_id).catch(() => {
        message.error("解析失败");
        return setLoading(false);
      });

      if (parseRes.code !== 200) {
        message.error(uploadRes.message);
        return setLoading(false);
      }
    }

    message.success("上传完成！");
    dispatch({
      type: "IS_UPLOAD/CHANGE",
      payload: false,
    });
    setLoading(false);
    history.push('/pdf_parse')
  };

  return (
    <Spin spinning={loading} tip={loadingText} indicator={<LoadingOutlined spin />} size="large">
      <MainBox>
        <Title>
          <div>
            <PlusSquareOutlined />
          </div>
          文件上传
        </Title>
        <UploadParams>
          <div>
            <span>Batch Name :</span>
            <Input placeholder="Uploaded on 06/28/24 at 10:48 am" />
          </div>
          <div>
            <span>Tags :</span>
            <Input placeholder="Search or add tags for images" />
          </div>
        </UploadParams>
        <UploadBox>
          <UploadIcon>
            <ArrowUpOutlined />
          </UploadIcon>

          <h1>请点击下方按钮上传文件</h1>
          <h1 style={{ marginTop: "-12px" }}>可以同时选中多个文件上传</h1>

          <Space>
            <Button icon={<FileDoneOutlined />} onClick={() => fileInput.current.click()}>
              选择文件
            </Button>
            <Button icon={<FolderOpenOutlined />} onClick={() => folderInput.current.click()}>
              选择文件夹
            </Button>
          </Space>

          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInput}
            multiple
            onChange={fileUpload}
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={folderInput}
            webkitdirectory={"true"}
            onChange={fileUpload}
          />

          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: 12, textAlign: "center" }}>上传文件的格式</p>
            <FileFormats>
              <div>
                <Space>
                  <FundOutlined />
                  Images
                </Space>

                <p>in .jpg, .png, .bmp, .webp</p>
              </div>
              <div>
                <Space>
                  <HeatMapOutlined /> Annotations
                </Space>
                <p>in .mov, .mp4, .avi</p>
              </div>
              <div>
                <Space>
                  <VideoCameraAddOutlined />
                  Videos
                </Space>
                <p>in .mov, .mp4, .avi</p>
              </div>
            </FileFormats>
          </div>

          <span style={{ marginTop: 24 }}>Need images to get started? We've got you covered.</span>
        </UploadBox>
      </MainBox>
    </Spin>
  );
}
const MainBox = styled.div`
  /* max-width: 1220px; */
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-size: 20px;
  display: flex;
  gap: 8px;
`;

const UploadParams = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  > div {
    width: 50%;
    display: flex;
    align-items: center;
    gap: 4px;
    > span {
      display: block;
      white-space: nowrap;
    }
  }
`;

const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 2vh;
  flex: 1;
  background-color: white;
  border-radius: 12px;
  border: 1px solid #827e7e58;
  overflow: auto;
  h1 {
    color: ${globalColor.buttonColor};
    font-weight: 500;
    letter-spacing: 4px;
    font-size: 24px;
  }
  > span {
    font-size: 12px;
  }
`;

const UploadIcon = styled.div`
  /* color: ${globalColor.buttonColor}; */
  color: white;
  background-color: ${globalColor.buttonColor};
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  font-size: 32px;
  border-radius: 50%;
`;

const FileFormats = styled.div`
  display: flex;
  gap: 40px;
  border: 1px dashed #827e7e58;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
`;

export default UploadPdf;
