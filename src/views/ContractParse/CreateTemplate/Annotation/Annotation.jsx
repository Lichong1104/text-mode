import React, { useEffect, useState, useRef } from "react";
import { ReactPictureAnnotation } from "react-picture-annotation";
import style from "./Annotation.module.scss";
import { Button, Space } from "antd";

const MyAnnotation = (props) => {
  const { imgUrl, markData } = props || {};
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  const [lineColor, setLineColor] = useState("red");

  const defaultShapeStyle = {
    /** 文本区域 **/
    padding: 5, // 文本内边距
    fontSize: 12, // 文本字体大小
    fontColor: "#212529", // 文本字体颜色
    fontBackground: "yellow", // 文本背景颜色
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif",

    /** 描边样式 **/
    lineWidth: 1, // 描边宽度
    shapeBackground: "hsla(210, 16%, 93%, 0.2)", // 标记中心的背景颜色
    shapeStrokeStyle: lineColor, // 线的颜色
    shadowBlur: 10, // 描边阴影模糊度
    shapeShadowStyle: "hsla(210, 9%, 31%, 0.35)", // 标记阴影颜色

    /** 变换器样式 **/
    transformerBackground: "#5c7cfa",
    transformerSize: 10,
  };
  // console.log(markData);
  const [dataList, setDataList] = useState(markData);
  const [selected, setSelected] = useState({});

  const onResize = () => {
    setPageSize({
      width: appRef.current.clientWidth,
      height: appRef.current.clientHeight,
    });
  };

  const appRef = useRef();

  useEffect(() => {
    onResize();
  }, []);

  useEffect(() => {
    // 在页面加载完成后获取窗口大小
    window.addEventListener("load", () => {
      setPageSize({
        width: appRef.current.clientWidth,
        height: appRef.current.clientHeight,
      });
    });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("load", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onSelect = (selectedId) => {
    const list = dataList.filter((v) => {
      return v.id == selectedId;
    });
    console.log(list[0]);
    setSelected(list[0] ? list[0] : {});
  };

  const onChange = (data) => {
    if (data.length === 0) return;
    setDataList(data);
  };

  return (
    <div className={style.mainBox}>
      <div ref={appRef}>
        <ReactPictureAnnotation
          image={imgUrl}
          onSelect={onSelect}
          onChange={onChange}
          annotationData={markData}
          width={pageSize.width}
          height={pageSize.height}
          annotationStyle={defaultShapeStyle}
        />
      </div>
      {/* <div>
        {selected?.id ? (
          <div className={style.current_line_info}>
            <p className={style.info_title}>选择：{selected?.id}</p>
            <div className={style.source_text}>
              <p>原文内容：</p>
              <textarea
                rows="5"
                value={selected?.comment}
                onChange={(e) => {
                  setSelected({ ...selected, comment: e.currentTarget.value });
                }}
              ></textarea>
            </div>
            <div className={style.target_text}>
              <p>目标内容：</p>
              <textarea
                rows="5"
                value={selected?.comment}
                onChange={(e) => {
                  setSelected({ ...selected, comment: e.currentTarget.value });
                }}
              ></textarea>
            </div>
            <div className={style.btnBox}>
              <Space size="large">
                <Button type="primary">重置</Button>
                <Button type="primary">提交</Button>
              </Space>
            </div>
          </div>
        ) : undefined}
      </div> */}
    </div>
  );
};

MyAnnotation.defaultsProps = {
  imgUrl: "",
  markData: [],
};

export default MyAnnotation;
