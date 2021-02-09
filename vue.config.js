// vue.config.js
const webpack = require('webpack')
const path = require('path')
const IS_PROD = process.env.NODE_ENV === 'production'
const resolve = (dir) => path.join(__dirname, dir)
module.exports = {
  publicPath: IS_PROD ? './' : '/',  // 公共路径
  indexPath: 'index.html', // 相对于打包路径index.html的路径
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'static', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建
  chainWebpack: config => {
    config.resolve.symlinks(true) // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none"
      return args
    })
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@utils', resolve('src/utils'))
      .set('@public', resolve('public'))
  },
  css: {
    extract: IS_PROD,
    requireModuleExtension: true,// 去掉文件名中的 .module
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // `globalVars` 定义全局对象，可加入全局变量
        globalVars: {
          primary: '#333'
        }
      }
    }
  },
  devServer: {
    overlay: { // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    host: "127.0.0.1",
    port: 2233, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    hotOnly: true, // 热更新
    proxy: { //配置多个跨域
      "/": {
        target: "http://127.0.0.1:2333",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false
      },
      "/api": {
        target: "http://127.0.0.1:2333/api",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  // 其他配置....
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      })
    ]
  }
}
