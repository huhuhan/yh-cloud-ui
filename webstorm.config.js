/**
 * 此文件只是为了让WebStorm可以识别实际位置
 * Setting中搜索webpack，选择该文件，确定。
 * @type {module:path}
 */
const path = require("path");

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
};
