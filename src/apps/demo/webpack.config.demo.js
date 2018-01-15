// Heavily edited from react-scripts
// See https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts/config
//
// NOTE: none of the dependencies here are listed in the package.json as they should all be installed by react-scripts
'use strict'

const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Default NODE_ENV for babel-preset-react-app
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

const PATHS = {
  DEMO_SRC: path.resolve(__dirname),
  OUTPUT: path.resolve(__dirname, '../../../public/apps/demo'),
}

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-scripts/config/polyfills'),
    path.resolve(PATHS.DEMO_SRC, 'index.js'),
  ],
  output: {
    path: PATHS.OUTPUT,
    filename: 'index.[chunkhash:8].js',
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    // Required for npm link to work properly (see https://github.com/webpack/webpack/issues/1866#issuecomment-284571531)
    symlinks: false,
  },
  module: {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            include: PATHS.DEMO_SRC,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              presets: [require.resolve('babel-preset-react-app')],
              cacheDirectory: true,
            },
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: false,
                },
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
  plugins: [
    // Add module names to factory functions so they appear in browser profiler.
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: path.resolve(PATHS.DEMO_SRC, 'index.html'),
    }),
  ],
}
