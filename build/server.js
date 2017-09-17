const path = require('path')
const webpack = require('webpack')
const Server = require('webpack-dev-server')
const webpackConfig = require('./webpack.dev')
const config = require('./config')
const LogPlugin = require('./log-plugin')

const devServerOptions = Object.assign({}, webpackConfig.devServer, config.devServer)

const host = devServerOptions.host
const port = devServerOptions.port

webpackConfig.entry.client = [
  path.join(__dirname, '../client/dev-client.js'),
  webpackConfig.entry.client
]

webpackConfig.plugins.push(new LogPlugin({ host, port }))

let compiler

try {
  compiler = webpack(webpackConfig)
} catch (err) {
  console.log(err.message)
  process.exit(1)
}

const server = new Server(compiler, Object.assign({
  noInfo: true,
  hot: true,
  historyApiFallback: true,
  overlay: true,
  disableHostCheck: true,
  publicPath: compiler.options.publicPath
}, devServerOptions))

server.listen(port, host)
