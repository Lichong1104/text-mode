import React, { useState, useEffect, useCallback, useRef } from "react";
import style from "./CreateTemplate.module.scss";
import ContractTable from "./ContractTable/ContractTable";
import { Space, message, InputNumber } from "antd";
import ContractModal from "./ContractModal/ContractModal";
import { getContractPdfListApi, getImageInfoApi, getPackJsonApi } from "@/api/httpApi";
import MyAnnotation from "./Annotation/Annotation";
import { Button, SliderField } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";
import axios from "axios";
import NProgress from "nprogress";

function CreateTemplate() {
  //解析字段
  const [isOpen, setIsOpen] = useState(false);
  const [field, setField] = useState([]);

  //表格
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 标注数据
  const [markData, setMarkData] = useState([]);

  //pdf
  const [parsePdfUrl, setParsePdfUrl] = useState("");

  // 当前选择得模板名
  const [tempName, setTempName] = useState("");

  const tempNameChange = (v) => {
    setTempName(v);
  };

  //获取PDF文件列表
  const [reload, setReload] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getContractPdfListApi();
      if (res.code === 200) {
        const pdfList = res.data.map((v) => ({ url: v, file: v }));

        const { url } = pdfList.find((v) => v.url === "b3e727320db942bc8738da33c4bd35fd");
        console.log(url);
        setParsePdfUrl(url);
      }
    };
    fetchData();
  }, [reload]);

  //解析PDF
  const parsePDF = () => {
    setLoading(true);
    getPackJsonApi(parsePdfUrl, tempName, "1")
      .then((res) => {
        setLoading(false);
        if (res.code !== 200) return message.error("解析失败，请重新解析！");
        message.success("解析成功！");
        console.log(res.data);
        setTableData(res.data);
      })
      .catch((error) => {
        setLoading(false);
        message.error("您当前的PDF不支持解析为JSON！");
      });
  };

  // 生成六位数随机数
  const randomNum = useCallback(() => {
    return Math.floor(Math.random() * 1000000);
  }, []);

  // 获取pdf的图片信息
  const [imgList, setImgList] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  useEffect(() => {
    if (parsePdfUrl) {
      getImageInfoApi(parsePdfUrl.split(".")[0]).then((res) => {
        if (res.code === 200) {
          setImgList(res.data.map((v) => v + "?" + randomNum()));
          setCurrentImg(0);
        }
      });
    }
  }, [parsePdfUrl, reload]);

  // 下一页
  const nextImg = () => {
    if (currentImg < imgList.length - 1) {
      setCurrentImg(currentImg + 1);
    } else {
      setCurrentImg(0);
    }
  };

  // 表格点击事件
  const tableValueClick = (text) => {
    // const markObj = tableData.find((v) => v.consequence === text);
    // console.log(markObj);
    // const markData = {
    //   id: markObj.column,
    //   // comment: markObj.consequence,
    //   mark: {
    //     type: "RECT",
    //     x: markObj.polygon[0][0],
    //     y: markObj.polygon[0][1],
    //     width: markObj.polygon[1][0] - markObj.polygon[0][0],
    //     height: markObj.polygon[3][1] - markObj.polygon[0][1],
    //   },
    // };
    // setMarkData([markData]);
    // setCurrentImg(markObj.page);
  };

  // 上一页
  const Previous = () => {
    if (currentImg <= 0) {
      return setCurrentImg(imgList.length - 1);
    }
    setCurrentImg(currentImg - 1);
  };

  // 上传
  const upload = async (event) => {
    NProgress.start();
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ocr_method", "rapid_ocr");
    formData.append("temporary", 1);

    axios.defaults.baseURL = "http://116.204.67.82:8083";
    const params = {
      method: "post",
      url: "/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const res = await axios(params).catch(() => {
      NProgress.done();
      return message.error("上传失败！");
    });
    if (res.data.code === 200) {
      message.success("上传成功！");
      setReload(!reload);
    }
    NProgress.done();
  };
  const inputRef = useRef(null);

  return (
    <div className={style.mainBox}>
      <div className={style.content}>
        <div className={style.image}>
          <MyAnnotation imgUrl={imgList[currentImg]} markData={markData} />
          <div className={style.imgBotBar}>
            <Space size="large">
              <Button
                size="small"
                colorTheme="info"
                variation="primary"
                backgroundColor={"#BF406A"}
                onClick={() => inputRef.current.click()}
              >
                上传
              </Button>
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
                onChange={(v) => {
                  console.log(v);
                  setCurrentImg(v);
                }}
                placeholder="请输入页码"
              />
            </Space>
            <span style={{ fontSize: "18px" }}>共 {imgList.length - 1} 页</span>
          </div>
        </div>

        <div className={style.table}>
          <ContractTable tableData={tableData} loading={loading} onValueClick={tableValueClick} />
          <ContractModal open={isOpen} onClose={() => setIsOpen(false)} onChange={tempNameChange} />
          <Space size="large">
            <input type="file" ref={inputRef} onChange={upload} style={{ display: "none" }} />
            {/* <Button
              size="small"
              colorTheme="info"
              variation="primary"
              // backgroundColor={globalColor.buttonColor}
              onClick={() => inputRef.current.click()}
            >
              上传
            </Button> */}
            <Button
              size="small"
              variation="primary"
              backgroundColor={globalColor.buttonColor}
              onClick={() => setIsOpen(true)}
            >
              添加解析字段
            </Button>
            <Button
              size="small"
              variation="primary"
              backgroundColor={globalColor.buttonColor}
              onClick={parsePDF}
            >
              解析当前PDF
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default CreateTemplate;
