const EslingPlugin = require('eslint-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';
  const filename = (ext) => (isProduction ? `[name].[contenthash].${ext}` : `[name].${ext}`);
  const optimization = () => {
    const configObj = {
      splitChunks: {
        chunks: 'all',
      },
    };
    if (isProduction) {
      configObj.minimizer = [new CssMinimizerWebpackPlugin()];
    }
    return configObj;
  };

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
    watch: !isProduction,
    watchOptions: {
      poll: true,
      ignored: /node_modules/,
    },
    optimization: optimization(),
    devServer: {
      historyApiFallback: {
        index: '/',
      },
      static: {
        directory: path.resolve(__dirname, 'src'),
      },
      open: true,
      compress: true,
      hot: true,
      port: 8080,
    },
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: `./scripts/${filename('js')}`,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource',
          exclude: [path.resolve(__dirname, 'src/assets/icons')],
          generator: {
            filename: `./img/[name].[ext]`,
          },
        },
        {
          test: /\.(svg)$/,
          oneOf: [
            {
              include: path.resolve(__dirname, 'src/assets/icons'),
              use: [
                {
                  loader: 'svg-sprite-loader',
                  options: {
                    symbolId: 'icon-[name]',
                  },
                },
                'svgo-loader',
              ],
            },
            {
              type: 'asset/resource',
              generator: {
                filename: './img/[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: `./fonts/[name].[ext]`,
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `./styles/${filename('css')}`,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        favicon: './src/assets/img/favicon.png',
        minify: {
          collapseWhitespace: isProduction,
        },
      }),
      new EslingPlugin({
        extensions: 'ts',
      }),
      new SVGSpritemapPlugin('src/assets/**/*.svg', {
        output: {
          filename: './img/sprites.svg',
        },
        sprite: {
          prefix: false,
        },
      }),
    ],
  };
  return config;
};
