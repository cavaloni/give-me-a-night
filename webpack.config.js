var path = require('path');
var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const context = path.resolve(__dirname, 'js');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

require('babel-core/register')({
  presets: ['es2015', 'react']
});
require.extensions['.scss'] = () => {
  return;
};
require.extensions['.css'] = () => {
  return;
};

module.exports = {
  context,
  entry: path.resolve(__dirname, 'js/index.js'),
  output: {
    path: path.resolve(__dirname, 'build/js'),
    filename: 'index.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  resolve: {
        extensions: ['', '.js', '.jsx', '.css'],
        modulesDirectories: [
          'node_modules'
        ]        
    },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.css$/,
      include: path.resolve(__dirname, 'js'),
      exclude: /(node_modules)/,
      loaders: [
          'style-loader',
          'css-loader?importLoader=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        ],
    }, 
    { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, loader: require.resolve("file-loader") + "?name=../[path][name].[ext]"},
    {   
        test: /\.js$/,
        include: path.resolve(__dirname, 'js'),
        loader: 'babel-loader',
        presets: ['es2015', 'react'],
      query: {
         plugins: [
           
            'transform-react-jsx',
            [
              'react-css-modules',
              {
                context
              }
            ]
         ]
      }
    }, ]
  }
};