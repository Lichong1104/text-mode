// UploadPage.jsx
import React from "react";
import styles from "./MultipleDocUpload.module.scss";
import axios from "axios";
import { message } from "antd";

const MultipleDocUpload = () => {
  const upload = async (e, time) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const params = {
      method: "post",
      url: "http://116.204.67.82:8893/upload" + time,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const res = await axios(params);

    if (res.data.code !== 200) return message.error("上传失败");

    message.success("上传成功！");
  };
  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadBox}>
        <div className={styles.uploadIcon}>
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <h1 className={styles.title}>上传文件</h1>
        <p className={styles.subtitle}>请选择您要上传的文件</p>
        <div className={styles.uploadList}>
          <div className={styles.uploadSection}>
            <label htmlFor="file1" className={styles.uploadButton}>
              文件1
              <input
                type="file"
                id="file1"
                onChange={(e) => upload(e, "/new")}
                className={styles.fileInput}
              />
            </label>
          </div>
          <div className={styles.uploadSection}>
            <label htmlFor="file2" className={styles.uploadButton}>
              文件2
              <input
                type="file"
                id="file2"
                onChange={(e) => upload(e, "/old")}
                className={styles.fileInput}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleDocUpload;
