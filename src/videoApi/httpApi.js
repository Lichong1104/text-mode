import { get, post } from "./request";

/**
 * 上传文件
 * @param {FormData} data
 * @returns
 */
export const uploadApi = (data) => post("/upload", data);

/**
 * 获取切分视频
 * @param {string} vid
 * @returns
 */
export const getCutVideoApi = (vid) => get("/analysisVideo?vid=" + vid);

/**
 * 改变切分
 * @param {list} data
 * @param {string} vid
 * @returns
 */
export const changeVideoApi = (data, vid) => get(`/handleVideo?data=${data}&vid=${vid}`);

/**
 * 获取视频信息
 * @param {string} vid
 * @returns
 */
export const getVideoInfoApi = (vid) => get(`/infoVideo?vid=${vid}`);

/**
 * 获取视频文件列表
 * @returns
 */
export const getVideoListApi = () => get("/videoDetails");

/**
 * 获取切分完成视频
 * @param {string} vid
 * @returns
 */
export const getCutVideoListApi = (vid) => get("/videoCutList?vid=" + vid);

/**
 * 删除视频
 * @param {string} vid
 * @returns
 */
export const delVideoApi = (vid) => get("/deleteInfo?vid=" + vid);
