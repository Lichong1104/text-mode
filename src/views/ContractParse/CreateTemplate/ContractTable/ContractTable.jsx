import React from "react";
import { Table } from "antd";

function ContractTable({ tableData, column, loading, onValueClick }) {
  console.log(tableData);
  const valueDivStyles = {
    height: "100%",
    cursor: "pointer",
  };

  const columns = [
    {
      title: column.field,
      dataIndex: "field",
      align: "center",
      width: "50%",
    },
    {
      title: column.value,
      dataIndex: "value",
      align: "center",
      width: "50%",
      render: (text) => (
        <div style={valueDivStyles} onClick={() => onValueClick(text)}>
          {text}
        </div>
      ),
    },
  ];
  // const data = tableData.map((v, i) => {
  //   return {
  //     key: i,
  //     field: v.column,
  //     value: v.consequence,
  //   };
  // });
  const field = Object.keys(tableData);
  const value = Object.values(tableData);

  const data = field.map((v, i) => {
    return {
      key: i,
      field: v,
      value: JSON.stringify(value[i]),
    };
  });

  return <Table columns={columns} loading={loading} dataSource={data} bordered />;
}
ContractTable.defaultProps = {
  column: { field: "解析字段", value: "解析结果" },
  tableData: [],
  loading: false,
  onValueClick: () => {},
};
export default ContractTable;
