import React, { useEffect, useState } from "react";
import style from "./DocPreview.module.scss";
import DocxView from "@/components/DocxView/DocxView";
import DataView from "../DataView/DataView";
import axios from "axios";
import { message } from "antd";
import { Button } from "@aws-amplify/ui-react";
import globalColor from "@/store/color";

function DocPreview() {
  const [docxData, setDocxData] = useState({ newUrl: "", oldUrl: "" });

  useEffect(() => {
    const loadDocx = async () => {
      const res = await axios.get("http://116.204.67.82:8893/files");
      if (res.data.code === 200) {
        setDocxData({
          newUrl: res.data.data.new,
          oldUrl: res.data.data.old,
        });
      } else {
        message.error("获取文件失败");
      }
    };
    loadDocx();
  }, []);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseDocx = async () => {
    setLoading(true);
    const newUrl = docxData.newUrl.split("new/")[1];
    const oldUrl = docxData.oldUrl.split("old/")[1];
    const url = `http://116.204.67.82:8893/check?new=${newUrl}&old=${oldUrl}`;
    const res = await axios.get(url).catch(() => {
      setLoading(false);
      return message.error("解析失败，请检查您的Docx文档是否正确！");
    });

    console.log(res.data);
    if (res.data.code === 200) {
      const data = res.data.data.same.map((v) => ({ ...v, key: v.code }));
      setTableData(data);
      message.success("解析成功！");
    } else {
      message.error("解析失败，请检查您的Docx文档是否正确！");
    }
    setLoading(false);
  };
  return (
    <div className={style.doc_box}>
      <div className={style.word_view}>
        <div className={style.view_item}>
          <DocxView src={docxData.newUrl} />
        </div>
        <div className={style.view_item}>
          <DocxView src={docxData.oldUrl} />
        </div>
      </div>
      <div className={style.table}>
        <div className={style.btn}>
          <h2>开始对比</h2>
          <Button
            size="small"
            variation="primary"
            backgroundColor={globalColor.buttonColor}
            onClick={parseDocx}
          >
            开始对比
          </Button>
        </div>

        <DataView tableData={tableData} loading={loading} />
      </div>
    </div>
  );
}

export default DocPreview;
