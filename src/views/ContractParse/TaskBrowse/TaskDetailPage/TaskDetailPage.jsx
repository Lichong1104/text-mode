import MyAnnotation from "../../CreateTemplate/Annotation/Annotation";
import ContractTable from "../../CreateTemplate/ContractTable/ContractTable";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Space, message, InputNumber } from "antd";
import { Button, SliderField } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";
import {
  getContractPdfListApi,
  getImageInfoApi,
  getPackJsonApi,
  getTaskDetailApi,
} from "@/api/httpApi";

function TaskDetailPage(props) {
  const { pdfName, page, templateName, onChange } = props || {};

  //表格
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 标注数据
  const [markData, setMarkData] = useState([]);

  // 获取pdf的图片信息
  const [imgList, setImgList] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const imgRes = await getImageInfoApi(pdfName.split(".")[0]);
      if (imgRes.code === 200) {
        setImgList(imgRes.data);
      }
      const tabRes = await getTaskDetailApi(page);

      if (tabRes.code === 200) {
        const result = tabRes.data.find((v) => v.pdf_name === pdfName);
        setTableData(result.template_info);
      }
      setLoading(false);
    };
    if (pdfName) {
      fetchData();
    }
  }, [pdfName]);

  // 下一页
  const nextImg = () => {
    if (currentImg < imgList.length - 1) {
      setCurrentImg(currentImg + 1);
    } else {
      setCurrentImg(0);
    }
  };

  // 上一页
  const Previous = () => {
    if (currentImg <= 0) {
      return setCurrentImg(imgList.length - 1);
    }
    setCurrentImg(currentImg - 1);
  };

  // 更新解析
  const uploadParse = async () => {
    setLoading(true);
    const res = await getPackJsonApi(pdfName, templateName, "");
    if (res.code === 200) {
      message.success("更新解析成功！");
      setTableData(res.data);
      onChange();
    }
    setLoading(false);
  };

  return (
    <MainBox>
      <ImageBox>
        <MyAnnotation imgUrl={imgList[currentImg]} markData={markData} />
        <ImgBotBar>
          <Space size="large">
            <Button
              size="small"
              variation="primary"
              backgroundColor={globalColor.buttonColor}
              onClick={Previous}
            >
              上一页
            </Button>
            <Button
              size="small"
              variation="primary"
              backgroundColor={globalColor.buttonColor}
              onClick={nextImg}
            >
              下一页
            </Button>

            {/* <SliderField
              max={imgList.length - 1}
              isValueHidden
              filledTrackColor={globalColor.buttonColor}
              value={currentImg}
              onChange={(v) => {
                setCurrentImg(v);
              }}
            /> */}
            <InputNumber
              value={currentImg}
              max={imgList.length - 1}
              min={0}
              onChange={(v) => setCurrentImg(v)}
              placeholder="请输入页码"
            />
          </Space>
          <span style={{ fontSize: "18px" }}>共 {imgList.length - 1} 页</span>
        </ImgBotBar>
      </ImageBox>

      <TableBox>
        <ContractTable tableData={tableData} loading={loading} />
        <Space size="large">
          <Button
            size="small"
            variation="primary"
            backgroundColor={globalColor.buttonColor}
            onClick={uploadParse}
          >
            更新解析
          </Button>
        </Space>
      </TableBox>
    </MainBox>
  );
}

const MainBox = styled.div`
  display: flex;
  height: 100%;

  flex-wrap: nowrap;
  > div {
    width: 50%;
  }
`;

const TableBox = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 20px;
  /* border: 1px solid rgba(128, 128, 128, 0.199); */
`;

const ImageBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ImgBotBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

TaskDetailPage.defaultsProps = {
  pdfName: "",
  page: 1,
  onChange: () => {},
};

export default TaskDetailPage;
