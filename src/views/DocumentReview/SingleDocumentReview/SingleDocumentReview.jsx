import { SelectOutlined, TableOutlined, TabletOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import globalColor from "@/store/color";
import { Spin, Tooltip, message } from "antd";
import axios from "axios";
import { getFilesApi, tableReviewApi, typoReviewApi } from "@/api/httpApi";
import nProgress from "nprogress";

function SingleDocumentReview() {
  const inputRef = React.useRef(null);

  // 文件名
  const [fileName, setFileName] = React.useState("投资管理合同无标注.docx");

  const [load, setLoad] = React.useState(false);

  const fetchData = async () => {
    const res = await getFilesApi();
    console.log(res.data);
    if (res.code !== 200) return message.error("获取文件失败");
    setFileName(res.data.office);
  };

  // 上传
  const upload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const params = {
      method: "post",
      url: "http://116.204.67.82:8893/upload/office",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios(params);
    console.log(res);
    if (res.data.code !== 200) return message.error("上传失败");
    message.success("上传成功！");
    fetchData();
  };

  const [loading, setLoading] = useState(false);

  // 错别字审核
  const typoReview = async () => {
    setLoading(true);
    const res = await typoReviewApi(fileName).catch(() => {
      message.error("审核失败");
      setLoading(false);
    });
    if (res.code !== 200) return message.error("审核失败");
    message.success("审核成功");

    setFileName(fileName.split(".")[0] + "_ghost_word." + fileName.split(".")[1]);
    setLoading(false);
    console.log(res);
  };

  const tableReview = async () => {
    setLoading(true);
    const res = await tableReviewApi(fileName).catch(() => {
      message.error("审核失败");
      setLoading(false);
    });
    if (res.code !== 200) return message.error("审核失败");
    message.success("审核成功");
    setFileName(fileName.split(".")[0] + "_table." + fileName.split(".")[1]);
    // setLoad(!load);
    setLoading(false);
    console.log(res);
  };

  // 工具列表
  const toolList = [
    { icon: <UploadOutlined onClick={() => inputRef.current.click()} />, title: "上传" },
    { icon: <SelectOutlined onClick={typoReview} />, title: "错别字审核" },
    { icon: <TableOutlined onClick={tableReview} />, title: "表格勾稽审核" },
  ];

  return (
    <MainBox>
      <ToolBar>
        <input type="file" style={{ display: "none" }} onChange={upload} ref={inputRef} />
        {toolList.map((v, i) => {
          return (
            <Tooltip key={i} placement="left" title={v.title}>
              <IconBox>{v.icon}</IconBox>
            </Tooltip>
          );
        })}
      </ToolBar>
      <IframeBox>
        <Spin spinning={loading}>
          <iframe
            src={`http://116.204.67.82:1200/example/editor?fileName=${fileName}`}
            frameBorder="0"
            width={"100%"}
            height={"100%"}
          ></iframe>
        </Spin>
      </IframeBox>
    </MainBox>
  );
}

const MainBox = styled.div`
  height: 100%;
  display: flex;
`;

const ToolBar = styled.div`
  width: 60px;
  border: 2px solid rgba(128, 128, 128, 0.2);
  border-right: none;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
`;

const IconBox = styled.div`
  padding: 0 6px;
  border-radius: 4px;
  font-size: 24px;
  color: ${globalColor.fontColor};
  background-color: ${globalColor.backgroundLightColor};
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: ${globalColor.buttonColor};
    color: white;
  }
`;

const IframeBox = styled.div`
  flex: 1;
  height: 100%;
  border: 2px solid rgba(128, 128, 128, 0.2);
  border-left: none;
`;

export default SingleDocumentReview;
