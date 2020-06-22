var pathConfig = require('./path.config');
const path = require('path');
module.exports = {
  // publicPath: 'http://fe.qq.com/',
  publicPath: pathConfig.publicPath,
  // devServer: {
  //   host: '192.168.124.7',
  //   port: 8080,
  // },
  transpileDependencies: [ 'vant', 'better-scroll'],
  configureWebpack: {
    resolve:{
      extensions: [ '.js', '.json', '.vue' ],
      modules: ['node_modules', path.resolve(__dirname, './src')]
    }
  }
}