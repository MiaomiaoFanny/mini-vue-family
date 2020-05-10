module.exports = {
  // 修复HMR热更新
  chainWebpack: config => config.resolve.symlinks(true),

  // 关闭保存时eslint检测
  lintOnSave: false
}