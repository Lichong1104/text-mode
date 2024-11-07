/**
 * 从路径中提取特定值用作侧边栏持久化展开
 * @param {string} path - 路径字符串
 * @returns {string} - 提取的值
 */
export const extractValueFromPath = (path) => {
  const startIndex = path.indexOf("/") + 1; // 找到第一个斜杠的索引，并加1
  const endIndex = path.indexOf("/", startIndex); // 从 startIndex 开始找到第二个斜杠的索引

  if (endIndex !== -1) {
    // 如果存在第二个斜杠
    return "/" + path.substring(startIndex, endIndex); // 提取 startIndex 到 endIndex 之间的部分作为值
  } else {
    return "/" + path.substring(startIndex); // 如果没有第二个斜杠，则提取 startIndex 到结尾的部分作为值
  }
};
