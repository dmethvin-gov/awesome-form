const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

module.exports = merge(require('./webpack.common.js'), {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    historyApiFallback: true,
  }
});
