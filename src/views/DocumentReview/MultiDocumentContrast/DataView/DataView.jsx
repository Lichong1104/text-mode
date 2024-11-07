import React from "react";
import { Table, Tooltip } from "antd";
const columns = [
  {
    title: "序号",
    dataIndex: "code",
    width: "100px",
    align: "center",
  },
  {
    title: "章节",
    dataIndex: "section",
    align: "center",
    width: "100px",
  },
  {
    title: "文本",
    dataIndex: "text",
    ellipsis: true,
    render: (v) => (
      <Tooltip
        overlayInnerStyle={{
          width: "500px",
          marginRight: "2100px",
          right: "200px",
        }}
        title={v}
        placement="leftBottom"
      >
        <div
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {v}
        </div>
      </Tooltip>
    ),
  },
];

const DataView = (props) => (
  <Table
    style={{
      width: "100%",
    }}
    columns={columns}
    dataSource={props.tableData}
    loading={props.loading}
    bordered
    // title={() => <h2>差异对比</h2>}
  />
);

DataView.defaultProps = {
  loading: false,
  tableData: [],
};

export default DataView;
