import axios from "axios";

const serverUrl = "http://116.204.67.82:8083";

const instance = axios.create({
  // baseURL: "/contract", // 请求的基础地址
  baseURL: serverUrl,
  timeout: 0, // 请求超时时间
});

// 全局请求拦截，发起网络请求之前执行
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 全局响应拦截，网络请求返回之后执行
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // NProgress.done();
    return Promise.reject(error);
  }
);

/**
 * 发起get请求
 * @param {*} url     地址
 * @param {*} params  url中传递的参数
 * @returns
 */
export const get = (url, params, headers) =>
  instance.get(url, {
    params, // 表示url中传递的参数
    headers,
  });

/**
 * 发起post请求
 * @param {*} url   地址
 * @param {*} data  数据
 * @returns
 */
export const post = (url, data) => instance.post(url, data);

/**
 * 发起put请求
 * @param {*} url   地址
 * @param {*} data  数据
 * @returns
 */
export const put = (url, data) => instance.put(url, data);

/**
 * 发起del请求
 * @param {*} url   地址
 * @param {*} params  数据
 * @returns
 */
export const del = (url, params, headers) =>
  instance.delete(url, {
    params, // 表示url中传递的参数
    headers,
  });

export default instance;
