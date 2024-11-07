import React, { useEffect, useState, useRef } from "react";
import { ReactPictureAnnotation } from "react-picture-annotation";
import style from "./Annotation.module.scss";
import { Button, Select, Space, Tooltip, message } from "antd";
import styled from "styled-components";
import { DeleteOutlined } from "@ant-design/icons";

const MyAnnotation = (props) => {
  // 生成一个三位数随机数函数
  const randomNum = () => {
    return Math.floor(Math.random() * 20);
  };
  const { imgUrl, markData, sizeChange } = props || {};
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  const [lineColor, setLineColor] = useState("red");

  const defaultShapeStyle = {
    /** 文本区域 **/
    padding: 5, // 文本内边距
    fontSize: 10, // 文本字体大小
    // fontColor: "black", // 文本字体颜色
    // fontBackground: "yellow", // 文本背景颜色
    fontColor: "yellow", // 文本字体颜色
    fontBackground: "#0402023d", // 文本背景颜色
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
  const [dataList, setDataList] = useState([]);
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
  }, [sizeChange]);

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

  useEffect(() => {
    setTimeout(() => setDataList(markData), 1);
  }, [markData]);

  // 被选中
  const onSelect = (selectedId) => {
    const list = dataList.filter((v) => {
      return v.id == selectedId;
    });
    setSelected(list[0] ? list[0] : {});
  };

  // 改变
  const onChange = (data) => {
    if (data.length === 0) return;
    setDataList(data);
  };

  // 删除
  const removeItem = () => {
    if (!selected.id) return message.error("删除失败！");
    const newList = dataList.filter((v) => v.id !== selected.id);
    setDataList(newList);
  };

  const selectOption = [
    { value: "Header", label: "Header" },
    { value: "Text", label: "Text" },
    { value: "Reference", label: "Reference" },
    { value: "Figure caption", label: "Figure caption" },
    { value: "Figure", label: "Figure" },
    { value: "Table caption", label: "Table caption" },
    { value: "Table", label: "Table" },
    { value: "Title", label: "Title" },
    { value: "Footer", label: "Footer" },
    { value: "Equation", label: "Equation" },
  ];

  useEffect(() => {
    props.onChange(dataList);
  }, [dataList]);

  // 选项改变
  const selectChange = (value) => {
    const data = dataList.map((v) => {
      if (v.id === selected.id) {
        return { ...v, comment: value };
      }
      return v;
    });
    setDataList(data);
  };

  return (
    <div className={style.mainBox}>
      <div ref={appRef}>
        <ReactPictureAnnotation
          image={imgUrl}
          inputElement={() => (
            <Placeholder>
              <Select
                size="small"
                options={selectOption}
                value={selected?.comment}
                onChange={selectChange}
                style={{ width: "150px" }}
              />
              <Tooltip title="删除">
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={removeItem}
                  danger
                  type="primary"
                />
              </Tooltip>
            </Placeholder>
          )}
          onSelect={onSelect}
          onChange={onChange}
          annotationData={dataList}
          width={pageSize.width}
          height={pageSize.height}
          annotationStyle={defaultShapeStyle}
        />
      </div>
    </div>
  );
};

const Placeholder = styled.div`
  padding: 6px;
  display: flex;
  gap: 4px;
  background-color: #eeeceb;
  border-radius: 8px;
`;

MyAnnotation.defaultProps = {
  imgUrl: "",
  markData: [],
  onChange: () => {},
};

export default MyAnnotation;
