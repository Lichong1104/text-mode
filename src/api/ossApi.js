import OSS from "ali-oss";
import { getToken } from "@/utils/handleToken";

const client = new OSS({
  region: "oss-cn-qingdao", // OSS区域
  accessKeyId: "1NYy11pbKZNpMWH6", // 阿里云访问密钥Access Key ID
  accessKeySecret: "8qjJq4uYIAycJuK3LgD0RuTyRh7Jfj", // 阿里云访问密钥Access Key Secret
  bucket: "fquantplus", // 存储桶名称
});

/**
 * 获取OSS文件列表
 * @param {String} prefix 文件路径
 * @returns {object} 文件列表
 */
export const getOSSListApi = (prefix, marker) => {
  return client.list({ prefix, delimiter: "/", marker });
};

/**
 * oss分片上传
 * @param {string} taskId
 * @param {File} file
 * @param {callback} progress
 * @returns
 */
export const multipartUploadApi = (taskId, taskType, file, progress) => {
  return client.multipartUpload(
    `videos/${taskType}/${getToken()}A1b2C3${taskId}A1b2C3${file.name}`,
    file,
    {
      progress,
      // 设置并发上传的分片数量。
      parallel: 4,
      // 设置分片大小。默认值为1 MB，最小值为100 KB。
      partSize: 1024 * 1024 * 5,
      // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
      meta: { year: 2020, people: "test" },
      // mime: "application/zip", // 修改MIME类型为zip
    }
  );
};

/**
 * 上传文件
 * @param {String} path - 上传的路径
 * @param {File} file - 上传的文件
 * @returns {object}
 */
export const uploadApi = (file) => {
  return client.put("text-moderation/ar_upload_pdf/" + file.name, file);
};

/**
 * 删除文件
 * @param {String} prefix - 路径
 */
export const deleteFileApi = async (prefix) => {
  const result = await getOSSListApi(prefix);
  console.log(result);
  const keysToDelete = result.objects.map((obj) => obj.name);
  await client.deleteMulti(keysToDelete);
};
