import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Table, Drawer, Space, message, Popconfirm, Image, Spin } from "antd";
import { Button } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";
import CuttingDetail from "./CuttingDetail/CuttingDetail";
import { delVideoApi, getVideoListApi, uploadApi } from "@/videoApi/httpApi";

function VideoCutting() {
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 删除
  const deleteVideo = async (vId) => {
    setConfirmLoading(true);
    const res = await delVideoApi(vId);
    if (res.code !== 200) {
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
      dataIndex: "v_name",
      render: (v, r) => (
        <span
          style={{ cursor: "pointer", color: globalColor.buttonColor }}
          onClick={() => videoDetail(r)}
        >
          {v}
        </span>
      ),
    },
    { title: "创建人", dataIndex: "user", width: 200 },
    { title: "文件路径", dataIndex: "v_path", ellipsis: true },
    {
      title: "预览",
      dataIndex: "img_path",
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
            onConfirm={() => deleteVideo(r.v_id)}
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
      const res = await getVideoListApi();
      if (res.code !== 200) return message.error(res.message);
      const data = res.data.map((item, index) => ({ ...item, key: index }));
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
    formData.append("user", "admin");

    const uploadRes = await uploadApi(formData).catch(() => {
      message.error("文件上传失败");
      return setLoading(false);
    });
    if (uploadRes.code !== 200) {
      message.error(uploadRes.message);
      return setLoading(false);
    }

    message.success("上传成功！");

    setLoading(false);
    setLoad(!load);
  };

  // 视频详情
  const videoDetail = (r) => {
    setVId(r.v_id);
    setVideoUrl(r.v_path);
    setDrawerOpen(true);
  };

  return (
    <Spin size="large" tip={loadingText} spinning={loading}>
      <MainBox>
        <BtnDiv>
          <h2>视频切割</h2>
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
        <Drawer
          title="视频详情"
          onClose={onClose}
          placement="top"
          style={drawerStyle}
          open={drawerOpen}
          // open
        >
          <CuttingDetail v_id={vId} videoUrl={videoUrl} />
        </Drawer>
      </MainBox>
    </Spin>
  );
}

const MainBox = styled.div`
  height: 100%;
  background-color: white;
`;

const drawerStyle = {
  height: "95vh",
  width: "85vw",
  margin: "0 auto",
};

const BtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

export default VideoCutting;
