import React, { useState, useEffect, useRef } from "react";
import { Tag, theme, Input, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Tags from "../Tags/Tags";

function FieldComponent(props) {
  const { token } = theme.useToken();
  const [fieldTags, setFieldTags] = useState(props.fieldTags);
  const [fieldInputShow, setFieldInputShow] = useState(false);
  const [fieldInputValue, setFieldInputValue] = useState("");
  const fieldInputRef = useRef(null);
  useEffect(() => {
    if (fieldInputShow) {
      fieldInputRef.current?.focus();
    }
  }, [fieldInputShow]);
  useEffect(() => {
    setFieldTags(props.fieldTags);
  }, [props.fieldTags]);
  useEffect(() => {
    props.tagsChange(fieldTags);
  }, [fieldTags]);

  const showFieldInput = () => {
    setFieldInputShow(true);
  };
  const fieldInputChange = (e) => {
    setFieldInputValue(e.target.value);
  };
  const fieldInputConfirm = () => {
    if (fieldInputValue.trim() !== "") {
      const newTags = fieldInputValue.split("，").map((tag) => tag.trim());
      const uniqueNewTags = newTags.filter((tag) => !fieldTags.includes(tag));
      setFieldTags([...fieldTags, ...uniqueNewTags]);
    }
    setFieldInputShow(false);
    setFieldInputValue("");
  };
  const tagPlusStyle = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: "flex",
        border: "1px dashed gray",
        marginTop: "12px",
        borderRadius: "12px",
        padding: "12px",
      }}
    >
      {props.children ? props.children[0] : undefined}

      <Tags
        tags={fieldTags}
        onChange={(v) => {
          setFieldTags(v);
        }}
      />

      {fieldInputShow ? (
        <Input
          ref={fieldInputRef}
          type="text"
          size="middle"
          style={{
            width: 150,
          }}
          value={fieldInputValue}
          onChange={fieldInputChange}
          onBlur={fieldInputConfirm}
          onPressEnter={fieldInputConfirm}
        />
      ) : (
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Tag
            onClick={showFieldInput}
            style={{ ...tagPlusStyle, fontSize: "16px", padding: "4px" }}
          >
            <PlusOutlined />
            添加解析字段
          </Tag>
          <div>
            <Space>
              {props.children ? props.children[1] : undefined}
              {props.children ? props.children[2] : undefined}
            </Space>
          </div>
        </Space>
      )}
    </Space>
  );
}
export default FieldComponent;
