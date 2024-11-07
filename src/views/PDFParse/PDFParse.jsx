import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Table, Drawer, Space, message, Popconfirm, Image } from "antd";
import { Button } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";
import { deletePdfApi, getPdfListApi, parseMarkdownApi, uploadPdfApi } from "@/pdfApi/httpApi";
import NProgress, { render } from "nprogress";
import PDFDetail from "./PDFDetail/PDFDetail";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";

function PDFParse() {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const history = useHistory();

  // 删除
  const deletePdf = async (pdfId) => {
    setConfirmLoading(true);
    const res = await deletePdfApi(pdfId);
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
      dataIndex: "pdf_name",
      render: (v, r) => (
        <span
          style={{ cursor: "pointer", color: globalColor.buttonColor }}
          onClick={() => pdfDetail(r)}
        >
          {v}
        </span>
      ),
    },
    { title: "创建人", dataIndex: "user", width: 200 },
    { title: "文件路径", dataIndex: "p_path", ellipsis: true },
    {
      title: "预览",
      dataIndex: "info_url",
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
            onConfirm={() => deletePdf(r.p_id)}
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

  const [pdfId, setPdfId] = useState("");

  // 加载
  const [load, setLoad] = useState(false);

  // 初始化
  useEffect(() => {
    const init = async () => {
      const res = await getPdfListApi();
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

  // 上传pdf
  const upload = async (e) => {
    NProgress.start();
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await uploadPdfApi(formData).catch(() => {
      message.error("文件上传失败");
      return NProgress.done();
    });
    if (uploadRes.code !== 200) {
      message.error(uploadRes.message);
      return NProgress.done();
    }

    const parseRes = await parseMarkdownApi(uploadRes.data.p_id).catch(() => {
      message.error("解析失败");
      return NProgress.done();
    });

    if (parseRes.code !== 200) {
      message.error(uploadRes.message);
      return NProgress.done();
    }

    message.success("上传成功！");
    setLoad(!load);

    NProgress.done();
  };

  // pdf详情
  const pdfDetail = (r) => {
    setPdfId(r.p_id);
    setDrawerOpen(true);
  };

  const isUpload = useSelector((state) => state.isUpload.isUpload);

  const [markFull, setMarkFull] = useState(false);

  const drawerStyle = {
    height: markFull ? "100vh" : "90vh",
    width: markFull ? "100vw" : "80vw",
    margin: "0 auto",
  };

  return (
    <MainBox>
      <BtnDiv>
        <h2>PDF解析</h2>
        <Button
          variation="primary"
          // onClick={() => uploadRef.current.click()}
          onClick={() => history.push("/upload_pdf")}
          size="small"
          backgroundColor={globalColor.buttonColor}
          disabled={isUpload}
        >
          上传
        </Button>
        <input type="file" style={{ display: "none" }} onChange={upload} ref={uploadRef} />
      </BtnDiv>
      <Table columns={columns} dataSource={tableData} bordered />
      <Drawer
        title="PDF详情"
        onClose={onClose}
        placement="top"
        style={drawerStyle}
        open={drawerOpen}
      >
        <PDFDetail
          pdfId={pdfId}
          sizeChange={(v) => {
            // console.log(v);
            setMarkFull(v);
          }}
        />
      </Drawer>
    </MainBox>
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

export default PDFParse;
