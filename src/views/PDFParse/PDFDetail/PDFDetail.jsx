import { InputNumber, Radio, Space, Spin, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MyAnnotation from "@/components/Annotation/Annotation";
import globalColor from "@/store/color";
import { Button } from "@aws-amplify/ui-react";
import { changeMarkApi, changeMarkdownApi, downloadApi, showPdfDetailApi } from "@/pdfApi/httpApi";
import "vditor/dist/index.css";
import Vditor from "vditor";

import "github-markdown-css";
import MdEditor from "for-editor";

function PDFDetail(props) {
  const { pdfId } = props;

  const [dataList, setDataList] = useState([]);
  // 页数
  const [page, setPage] = useState(0);
  // 标注数据
  const [markData, setMarkData] = useState([]);
  // 新的数据
  const [newMarkData, setNewMarkData] = useState([]);
  // markdown
  const [markdown, setMarkdown] = useState("");

  const [load, setLoad] = useState(false);

  const init = async () => {
    const res = await showPdfDetailApi(pdfId);
    if (res.code !== 200) return message.error(res.message);
    const data = res.data.map((v, i) => ({ ...v, id: i + 1 }));
    setDataList(data);
  };

  useEffect(() => {
    setDataList([]);
    setMarkData([]);
    setMarkdown("");
    setPage(0);

    init();
  }, [pdfId, load]);

  // 标注数据
  useEffect(() => {
    if (dataList.length === 0) return;
    const data = dataList[page].layouts_data.map((v, i) => {
      return {
        id: i + 1,
        comment: v.label,
        mark: {
          type: "RECT",
          x: v.bbox[0],
          y: v.bbox[1],
          width: v.bbox[2] - v.bbox[0],
          height: v.bbox[3] - v.bbox[1],
        },
      };
    });
    setMarkData(data);
    setMarkdown(dataList[page].markdown);
  }, [dataList, page]);

  // 上一页
  const prevPage = () => {
    if (page === 0) return message.warning("已经是第一页！");
    setPage(page - 1);
  };

  // 下一页
  const nextPage = () => {
    if (page === dataList.length - 1) return message.warning("已经是最后一页！");
    setPage(page + 1);
  };

  const [markLoading, setMarkLoading] = useState(false);

  // 重新解析
  const reParse = async () => {
    for (let i = 0; i < newMarkData.length; i++) {
      // 判断每个item中是否存在comment属性并且不为空
      if (!newMarkData[i].comment) return message.warning("有新添加数据未填写label！");
    }
    setMarkLoading(true);
    const data = newMarkData.map((v) => {
      return {
        bbox: [v.mark.x, v.mark.y, v.mark.x + v.mark.width, v.mark.y + v.mark.height],
        page_number: page + 1,
        label: v.comment,
      };
    });
    const res = await changeMarkApi(pdfId, page + 1, data);
    if (res.code !== 200) {
      setMarkLoading(false);
      return message.error(res.message);
    }
    init();
    setMarkdown(res.data.markdown_text);
    setMarkLoading(false);
    message.success("解析成功！");
  };

  const [radioValue, setRadioValue] = useState("markdown");
  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const [downloading, setDownloading] = useState(false);

  // 下载
  const download = async () => {
    setDownloading(true);
    const res = await downloadApi(pdfId, radioValue);
    setDownloading(false);
    if (res.code !== 200) return message.error(res.message);
    window.open(res.data, "_self");
  };

  // markdown toolbar
  const markdownToolbar = {
    h1: true, // h1
    h2: true, // h2
    h3: false, // h3
    h4: false, // h4
    img: true, // 图片
    link: true, // 链接
    code: true, // 代码块
    preview: true, // 预览
    expand: true, // 全屏
    /* v0.0.9 */
    undo: true, // 撤销
    redo: true, // 重做
    save: true, // 保存
    /* v0.2.3 */
    subfield: true, // 单双栏模式
  };

  // markdown 加载
  const [markdownLoading, setMarkdownLoading] = useState(false);

  // markdown保存
  const markdownSave = async (text) => {
    setMarkdownLoading(true);
    const res = await changeMarkdownApi(pdfId, page + 1, text);
    if (res.code !== 200) {
      setMarkdownLoading(false);
      return message.error(res.message);
    }
    setMarkdownLoading(false);
    message.success("保存成功！");
  };

  // 标注数据改变
  const markDataChange = (v) => {
    const value = v.map((v) => ({ comment: v.comment, mark: v.mark }));
    setNewMarkData(value);
  };

  const [isMarkFull, setIsMarkFull] = useState(false);

  const [vd, setVd] = useState();
  useEffect(() => {
    const vditor = new Vditor("vditor", {
      after: () => {
        vditor.setValue(markdown);
        setVd(vditor);
      },
      // 监听全屏按钮的点击事件
    });
    // Clear the effect

    return () => {
      vd?.destroy();
      setVd(undefined);
    };
  }, [markdown, isMarkFull]);

  useEffect(() => { }, []);

  return (
    <MainBox>
      <Body>
        <div style={{}}>
          <Spin spinning={markLoading}>
            <MyAnnotation
              sizeChange={isMarkFull}
              imgUrl={dataList[page]?.img_url}
              markData={markData}
              onChange={markDataChange}
            />
          </Spin>
        </div>

        {isMarkFull ? (
          ""
        ) : (
          <div>
            <Spin spinning={markdownLoading}>
              <div id="vditor" className="vditor" style={{ height: "100%" }} />
            </Spin>
          </div>
        )}
      </Body>
      <Footer>
        <div>
          <Space size="large">
            <Button
              variation="primary"
              onClick={() => prevPage()}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              上一页
            </Button>
            <Button
              variation="primary"
              onClick={() => nextPage()}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              下一页
            </Button>
            <span style={{ fontSize: "18px" }}>第{page + 1}页</span>
            <Button
              variation="primary"
              onClick={() => {
                setIsMarkFull(!isMarkFull);
                props.sizeChange(!isMarkFull);
              }}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              全屏
            </Button>
          </Space>{" "}
          <span style={{ fontSize: "18px" }}>共 {dataList.length} 页</span>
        </div>
        <div>
          <Space size="large">
            <Radio.Group onChange={onRadioChange} value={radioValue}>
              <Space>
                <Radio value={"markdown"}>markdown</Radio>
                <Radio value={"word"}>docx</Radio>
              </Space>
            </Radio.Group>
            <Button
              variation="primary"
              onClick={download}
              size="small"
              isLoading={downloading}
              loadingText="加载中..."
              backgroundColor={globalColor.buttonColor}
            >
              下载
            </Button>
            <Button
              variation="primary"
              onClick={reParse}
              size="small"
              backgroundColor={globalColor.buttonColor}
            >
              解析
            </Button>
          </Space>
        </div>
      </Footer>
    </MainBox>
  );
}

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
`;

const Body = styled.div`
  flex: 1;
  height: 80%;
  display: flex;
  gap: 12px;
  > div:nth-child(1) {
    flex: 1;
  }
  > div:nth-child(2) {
    width: 50%;
    border-radius: 8px;
  }
  > pre {
    width: 50%;
    padding: 16px;
    height: 100%;
    border-radius: 8px;

    white-space: pre-wrap;
    background-color: #f7f4f2;
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 20px;
  > div {
    width: 50%;
  }
  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
  }
  > div:nth-child(2) {
    display: flex;
    justify-content: flex-end;
  }
`;

PDFDetail.defaultProps = {
  pdfId: "",
};

export default PDFDetail;
