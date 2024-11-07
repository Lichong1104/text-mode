import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Table, Drawer, Space, message, Popconfirm, Image, Spin, Modal, Typography } from "antd";
import { Button } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";
import axios from "axios";
import { delVideoApi, getVideoListApi, uploadApi } from "@/videoApi/httpApi";

const { Paragraph, Text } = Typography;

function VideoDesc() {
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 删除
  const deleteVideo = async (vId) => {
    setConfirmLoading(true);
    const res = await axios.get("http://116.204.67.82:8786/api/videoNotion/videoDelete?vid=" + vId);
    if (res.data.code !== 200) {
      setConfirmLoading(false);
      return message.error(res.message);
    }
    setConfirmLoading(false);
    message.success("删除成功！");
    setLoad(!load);
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "video_name",
      render: (v, r) => (
        <span
          style={{ cursor: "pointer", color: globalColor.buttonColor }}
          onClick={() => videoDetail(r)}
        >
          {v}
        </span>
      ),
    },
    { title: "创建人", dataIndex: "user", width: 200, render: (v) => "admin" },
    { title: "文件路径", dataIndex: "video_path", ellipsis: true },
    {
      title: "预览",
      dataIndex: "image_path",
      render: (v) => <Image width="50px" src={v} />,
      width: 120,
      align: "center",
    },
    { title: "创建时间", dataIndex: "c_time" },
    {
      title: "操作",
      render: (v, r) => (
        <Space>
          {/* <span>预览</span> */}
          <Popconfirm
            title="删除此项"
            description=""
            okButtonProps={{
              loading: confirmLoading,
            }}
            onConfirm={() => deleteVideo(r.video_id)}
            okText="是"
            cancelText="否"
          >
            <span style={{ cursor: "pointer", color: "red" }}>删除</span>
          </Popconfirm>
        </Space>
      ),
      width: 70,
    },
  ];
  const [tableData, setTableData] = useState([]);

  const [vId, setVId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // 加载
  const [load, setLoad] = useState(false);

  // 初始化
  useEffect(() => {
    const init = async () => {
      const res = await axios.get("http://116.204.67.82:8786/api/videoNotion/videoDetails");
      if (res.data.code !== 200) return message.error(res.data.message);
      const data = res.data.data.map((item, index) => ({ ...item, key: index }));

      setTableData(data);
    };
    init();
  }, [load]);

  // 抽屉
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onClose = () => setDrawerOpen(false);

  const uploadRef = useRef(null);

  // 加载
  const [loading, setLoading] = useState(false);
  // 加载文本
  const [loadingText, setLoadingText] = useState("");

  // 上传视频
  const upload = async (e) => {
    setLoadingText("正在上传视频");
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("user", "admin");

    const uploadRes = await axios({
      method: "post",
      url: "http://116.204.67.82:8786/api/videoNotion/upload?user_id=abcde",
      data: formData,
    }).catch(() => {
      message.error("文件上传失败");
      return setLoading(false);
    });
    if (uploadRes.data.code !== 200) {
      message.error(uploadRes.data.message);
      return setLoading(false);
    }

    message.success("上传成功！");

    setLoading(false);
    setLoad(!load);
  };

  const [modalLoading, setModalLoading] = useState(false);

  const [text, setText] = useState("");

  // 视频详情
  const videoDetail = async (r) => {
    setText("");
    setVideoUrl("");
    setVId(r.video_id);
    setModalLoading(true);
    setDrawerOpen(true);

    const res = await axios(
      "http://116.204.67.82:8786/api/videoNotion/videoReturn?vid=" + r.video_id
    );

    if (res.data.code !== 200) {
      message.error(res.data.message);
      setModalLoading(false);
      return;
    }

    setModalLoading(false);
    message.success("获取成功！");
    setText(res.data.data);
    setVideoUrl(r.video_path);
  };

  // 编辑
  const edit = async (v) => {
    if (v === text) return;
    setText(v);
    const res = await axios.get(
      `http://116.204.67.82:8786/api/videoNotion/videoUpdate?vid=${vId}&result=${v}`
    );
    if (res.data.code !== 200) return message.error(res.data.message);
    message.success("修改成功！");
  };

  return (
    <Spin size="large" tip={loadingText} spinning={loading}>
      <MainBox>
        <BtnDiv>
          <h2>视频标注</h2>
          <Button
            variation="primary"
            onClick={() => uploadRef.current.click()}
            size="small"
            backgroundColor={globalColor.buttonColor}
          >
            上传
          </Button>
          <input type="file" style={{ display: "none" }} onChange={upload} ref={uploadRef} />
        </BtnDiv>
        <Table columns={columns} dataSource={tableData} bordered />
        <Modal
          title={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ width: "58%" }}>视频详情</span>
              <span style={{ width: "51%" }}>视频描述</span>
            </div>
          }
          onCancel={onClose}
          onOk={onClose}
          placement="top"
          open={drawerOpen}
          width={"50vw"}

          // open
        >
          <Spin spinning={modalLoading} tip="加载中...">
            <VideoDetail>
              <video src={videoUrl} controls playsInline type="video/mp4"></video>
              <div>
                <Paragraph
                  copyable
                  editable={{
                    onChange: edit,
                  }}
                >
                  {text}
                </Paragraph>
              </div>
            </VideoDetail>
          </Spin>
        </Modal>
      </MainBox>
    </Spin>
  );
}

const MainBox = styled.div`
  height: 100%;
  background-color: white;
`;

const BtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

const VideoDetail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 24px;
  height: 30vh;
  video {
    width: 50%;
    height: 100%;
    background-color: #f5f5f5;
  }
  > div {
    width: 50%;
    height: 100%;
    overflow: auto;
    background-color: #f5f5f5;
    padding: 12px;
  }
`;

export default VideoDesc;
