var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname + '/src',
  entry: ['./index.jsx'],
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    publicPath: ""
  },
  devServer: {
    contentBase: 'public'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader'
    }]
  },
  resolve: {
    alias: {
      'react-chm': path.join(__dirname, '..', 'build', 'react-chm')
    },
    extensions: ['', '.js', '.jsx']
  }
};
