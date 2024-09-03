const path = require('path')
const HWP = require('html-webpack-plugin')
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, '/src/index.js'),
  output: {
    filename: 'build.js',
    path: path.join(__dirname, '/public'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg|png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url'),
    },
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new HWP({ template: path.join(__dirname, '/src/index.html') }),
    new webpack.ContextReplacementPlugin(/\/@0x\//, data => {
      delete data.dependencies[0].critical
      return data
    }),
    new CopyWebpackPlugin({
      patterns: [
          { from: 'public' }
      ]
  })
  ],
}
