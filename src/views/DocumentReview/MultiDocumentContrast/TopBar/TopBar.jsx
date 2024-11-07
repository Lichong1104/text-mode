// TopBar.jsx
import React, { useState } from "react";
import styles from "./TopBar.module.scss";
import MultipleDocUpload from "../MultipleDocUpload/MultipleDocUpload";
import DocxView from "@/components/DocxView/DocxView";
import DataView from "../DataView/DataView";

const TopBar = (props) => {
  const optionList = [
    {
      key: 1,
      item: <MultipleDocUpload />,
      name: "上传文档",
    },
    {
      key: 2,
      item: <DocxView />,
      name: "对比结果",
    },
    // {
    //   key: 3,
    //   item: <DataView />,
    //   name: "解析",
    // },
  ];

  const [selectedOption, setSelectedOption] = useState(1);

  const handleOptionClick = (v) => {
    setSelectedOption(v.key);
    props.onChange(v);
  };

  return (
    <div className={styles.topBar}>
      {optionList.map((v, i) => {
        return (
          <div
            key={v.key}
            className={selectedOption === v.key ? styles.selected : styles.option}
            onClick={() => handleOptionClick(v)}
          >
            {v.name}
          </div>
        );
      })}
    </div>
  );
};

TopBar.defaultProps = {
  onChange: () => {},
};

export default TopBar;
