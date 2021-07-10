const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const postcssConfig = require('./postcss.config');

const makeConfig = () => {
  const plugins = [
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
      chunkFilename: '[id].css',
    }),
  ];

  const config = {
    entry: {
      index: ['./src/index.ts'],
    },
    output: {
      path: path.resolve(__dirname, '../dist/umd'),
      filename: '[name].js',
      library: 'lazyLoadAssets',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /^(?!.*\.{test,min}\.(js|ts)x?$).*\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: true,
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.(scss|sass|css)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: (resourcePath, context) => {
                  const newPath = path.relative(path.dirname(resourcePath), context);
                  return newPath.replace('\\', '/') + '/css/';
                },
              },
            },
            'css-loader',
            { loader: 'postcss-loader', options: postcssConfig },
            'sass-loader',
          ],
        },
        {
          test: /.(woff(2)?|eot|ttf)(\?[a-z0-9=\.]+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '../fonts/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '../img-loader/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins,
    resolve: {
      mainFields: ['es2015', 'module', 'jsnext:main', 'main'],
      extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.ts', '.tsx'],
      symlinks: false,
      cacheWithContext: false,
    },
  };
  return config;
};

module.exports = makeConfig();
