var webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  entry: [
    './CalendarHeatMap.jsx'
  ],
  output: {
    path: __dirname + '/build',
    filename: 'react-chm.js',
    libraryTarget: 'umd',
    library: 'CalendarHeatMap',
  },
  externals: {
    react: 'react',
    d3: 'd3',
    "d3-time": 'd3-time',
    'd3-time-format': 'd3-time-format',
    'd3-scale': 'd3-scale'
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
    extensions: ['', '.js', '.jsx']
  }
};
