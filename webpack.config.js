const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production', // 使用生产模式，自动开启优化
  entry: './src/index.tsx', // 入口文件，指向你的主文件
  output: {
    filename: 'index.js', // 输出文件名
    path: path.resolve(__dirname, 'dist'), // 输出文件目录
    library: 'MyLibrary', // 你的库名
    libraryTarget: 'umd', // 通用模块定义，使包可以在 Node.js 和浏览器中使用
    globalObject: 'this', // 解决 UMD 模式下的 `window` 问题
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // 自动解析的扩展名
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // 匹配 .ts 和 .tsx 文件
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true, // 启用代码压缩
    minimizer: [new TerserPlugin({ extractComments: false })], // 使用 TerserPlugin 进行压缩
  },
};
