import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import { TweenOneGroup } from "rc-tween-one";

function Tags(props) {
  const [tags, setTags] = useState(props.tags);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    props.onChange(newTags);
    setTags(newTags);
  };
  useEffect(() => {
    setTags(props.tags);
  }, [props.tags]);
  const forMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        style={{
          fontSize: "16px",
          padding: "6px",
          marginTop: "12px",
        }}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span
        key={tag}
        style={{
          display: "inline-block",
        }}
      >
        {tagElem}
      </span>
    );
  };
  const tagChild = tags.map(forMap);

  return (
    <TweenOneGroup
      enter={{
        scale: 0.8,
        opacity: 0,
        type: "from",
        duration: 100,
      }}
      onEnd={(e) => {
        if (e.type === "appear" || e.type === "enter") {
          e.target.style = "display: inline-block";
        }
      }}
      leave={{
        opacity: 0,
        width: 0,
        scale: 0,
        duration: 200,
      }}
      appear={false}
    >
      {tagChild}
    </TweenOneGroup>
  );
}

export default Tags;
