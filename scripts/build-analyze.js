process.env.NODE_ENV = 'production'
const Analyzer = require('webpack-bundle-analyzer')

const webpackConfigProd = require('react-scripts/config/webpack.config.prod')

webpackConfigProd.plugins.push(
  new Analyzer.BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'report.html',
    generateStatsFile: true,
  })
)

require('react-scripts/scripts/build')
