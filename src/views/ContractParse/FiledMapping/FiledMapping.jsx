import { Table } from "antd";
import React, { useState } from "react";
import styled from "styled-components";

function FiledMapping() {
  // 原始数据
  const [sourceData, setSourceData] = useState([]);
  const [sourceColumns, setSourceColumns] = useState([]);

  // 模板数据
  const [templateData, setTemplateData] = useState([]);
  const [templateColumns, setTemplateColumns] = useState([]);

  // 结果数据
  const [resultData, setResultData] = useState([]);
  const [resultColumns, setResultColumns] = useState([]);

  return (
    <MainBox>
      <TopRow>
        <div>
          <Table
            title={() => <h3>原始数据</h3>}
            bordered
            dataSource={sourceData}
            columns={sourceColumns}
          />
        </div>
        <div>
          <Table
            title={() => <h3>模板数据</h3>}
            bordered
            dataSource={templateData}
            columns={templateColumns}
          />
        </div>
      </TopRow>
      <BottomRow>
        <div>
          <Table
            title={() => <h3>结果数据</h3>}
            bordered
            dataSource={resultData}
            columns={resultColumns}
          />
        </div>
      </BottomRow>
    </MainBox>
  );
}

const MainBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopRow = styled.div`
  display: flex;
  gap: 12px;
  > div {
    width: 50%;
  }
`;

const BottomRow = styled.div`
  > div {
    width: 100%;
  }
`;

export default FiledMapping;
