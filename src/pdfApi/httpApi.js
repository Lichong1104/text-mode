import { get, post } from "./request";

/**
 * 获取pdf文件列表
 * @returns
 */
export const getPdfListApi = () => get("/pdfInfo");

/**
 * 上传pdf
 * @param {FormData} data
 * @returns
 */
export const uploadPdfApi = (data) => post("/upload", data);

/**
 * 获取pdf详情
 * @param {string} p_id
 * @returns
 */
export const showPdfDetailApi = (p_id) => get("/show_pdf_detail?p_id=" + p_id);

/**
 * 改变标注数据
 * @param {string} p_id
 * @param {number} page_number
 * @param {list} layouts_data
 * @returns
 */
export const changeMarkApi = (p_id, page_number, layouts_data) => {
  return post("/modify_layouts", { p_id, page_number, layouts_data });
};

/**
 * 解析标注数据
 * @param {string} p_id
 * @returns
 */
export const parseMarkApi = (p_id) => get("/extract_layouts?p_id" + p_id);

/**
 * 解析markdown数据
 * @param {string} p_id
 * @returns
 */
export const parseMarkdownApi = (p_id) => get("/extract_pdf?p_id=" + p_id);

/**
 * 下载
 * @param {string} p_id
 * @param {string} file_type
 * @returns
 */
export const downloadApi = (p_id, file_type) => {
  return get(`/download?p_id=${p_id}&file_type=${file_type}`);
};

/**
 * 删除pdf
 * @param {string} p_id
 * @returns
 */
export const deletePdfApi = (p_id) => get("/delete_info?p_id=" + p_id);

/**
 * 修改markdown
 * @param {string} p_id
 * @param {number} page_number
 * @param {string} markdown
 * @returns
 */
export const changeMarkdownApi = (p_id, page_number, new_markdown) => {
  return post("/modify_markdown", { p_id, page_number, new_markdown });
};
