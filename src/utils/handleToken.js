/**
 * 将给定的 token 值设置到 sessionStorage 中。
 * @param {string} token - 要设置的token值
 * @returns {undefined} - 该函数没有返回值
 */
export const setToken = (token) => sessionStorage.setItem("token", token);

/**
 * 获取token
 * @returns {undefined} - 该函数没有返回值
 */
export const getToken = () => sessionStorage.getItem("token");

/**
 * 删除token
 * @returns {undefined} - 该函数没有返回值
 */
export const removeToken = () => sessionStorage.removeItem("token");

/**
 * 判断是否登录
 * @returns {boolean}
 */
export const isLogin = () => (getToken() ? true : false);
