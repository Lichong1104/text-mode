import { post, get } from "./request";
import { getToken } from "@/utils/handleToken";

/**
 * 获取pdfjson
 * @param {*} pdfName
 * @param {*} columns
 * @returns
 */
export const getPackJsonApi = (pdfName, templateName, temporary) => {
  return get(
    `/analysisPdf?u_id=b903bcfd233c411a8510c921b3f8fb1d&pdf_name=${pdfName}-${templateName}&temporary=${temporary}`
  );
};

/**
 * 获取图片信息
 * @param {string} pdfName - PDF名称
 * @returns {JSON} - 获取到的JSON
 */
export const getImageInfoApi = (pdfName = "ImportAndExportLoanContract") => {
  return get("/showImg?pdf_name=" + pdfName);
};

/**
 * 获取合同列表
 * @returns {JSON} - 获取到的PDF列表
 */
export const getContractPdfListApi = () => get("/showPdf");

/**
 * 添加一个模板
 * @param {string} templateName - 模板名
 * @param {string} templateData - 模板数据
 * @returns {JSON}
 */
export const addFieldTagApi = (templateName, templateData) => {
  return get(
    `/template/update_template?u_id=${getToken()}&t_name=${templateName}&t_info=${JSON.stringify(
      templateData
    )}`
  );
};

/**
 * 返回审核过的模板列表
 * @returns {JSON}
 */
export const getReviewedTempListApi = () => get("/template/analysis_template?t_name=");

/**
 * 返回多状态模板列表
 * @returns {JSON}
 */
export const getNotReviewTempListApi = (review) => {
  return get(`/template/get_template?t_name=&review=` + review);
};

/**
 * 获取审核过当前模板的字段
 * @param {string} templateName
 * @returns
 */
export const getReviewedTempParamsApi = (templateName) => {
  return get("/template/analysis_template?t_name=" + templateName);
};

/**
 * 获取未审核当前模板的字段
 * @param {string} templateName
 * @returns
 */
export const getNotReviewTempParamsApi = (templateName, review) => {
  return get(`/template/get_template?t_name=${templateName}&review=${review}`);
};

/**
 * 审核模板
 * @param {string} templateName
 * @param {number} review
 * @returns
 */
export const reviewTempApi = (templateName, review) => {
  return get(`/template/submit_template?t_name=${templateName}&review=${review}`);
};

/**
 * 删除模板
 * @param {string} templateName
 * @returns
 */
export const removeTempApi = (templateName) => {
  return get("/template/delete_template?t_name=" + templateName);
};

/**
 *  获取任务列表
 * @param {number} page
 * @returns
 */
export const getTaskListApi = (page) => get(`/task/show_task?page=${page}&u_id=` + getToken());

/**
 * 获取任务详情列表
 * @param {number} page
 * @returns
 */
export const getTaskDetailApi = (page) => get("/task/show_task_details?page=" + page);

/**
 * 改变任务状态
 * @param {string} pdfName
 * @param {number} review
 * @returns
 */
export const changeTaskStatusApi = (pdfName, review) => {
  return get(`/task/change_task?pdf_name=${pdfName}&review=${review}`);
};

/**
 * 获取未审核的所有任务
 * @param {number} page
 * @returns
 */
export const getNotReviewTaskListApi = (page) => get("/task/show_review_task?page=" + page);

/**
 *  获取未审核的pdf字段
 * @param {string} pdfName
 * @returns
 */
export const getNotReviewTaskDetailApi = (pdfName) => {
  return get("/task/show_task_result?pdf_name=" + pdfName);
};

/**
 * 错别字审核
 * @param {string} fileName
 */
export const typoReviewApi = (fileName) => {
  return get("http://116.204.67.82:8893/office/ghost_word?office_file=" + fileName);
};

/**
 * 获取excel字段
 * @param {string} fileName
 * @returns
 */
export const getExcelParamsApi = (fileName) => {
  return get(`http://116.204.67.82:8893/get_excel?excel_file=${fileName}.xlsx`);
};

/**
 * 获取文件列表
 * @returns
 */
export const getFilesApi = () => get("http://116.204.67.82:8893/files");

/**
 * 表格审核
 * @param {string} fileName
 * @returns
 */
export const tableReviewApi = (fileName) => {
  return get("http://116.204.67.82:8893/office/verification?office_file=" + fileName);
};

/**
 *  验证excel
 * @returns
 */
export const ruleCheckApi = () => {
  return get(`http://116.204.67.82:8893/rule_check?docs=['产品基本信息表.docx', '外部信用评级报告.docx', '资产买卖协议.docx', '法律意见书.docx', '标准条款.docx', '托管合同.docx', '首单批复文件.docx', '原始权益人承诺书.docx', '资产服务协议.docx', '风险评估报告.docx', '设立报告.docx', '合规承诺书.docx', '募集说明书.docx', '增信协议.docx', '要件要点表.docx', '产品登记申请报告.docx', '内部信用评级报告.docx', '合规自查表.docx']
  &excel=登记要件要点表(1).xlsx`);
};

/**
 * 清除docx
 * @returns
 */
export const clearDocxApi = () => get("http://116.204.67.82:8893/clear_docx");
