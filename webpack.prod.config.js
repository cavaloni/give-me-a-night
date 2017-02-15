var path = require('path');
var webpack = require('webpack');
const context = path.resolve(__dirname, 'js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


require('babel-core/register')({
  presets: ['es2015', 'react']
});
require.extensions['.scss'] = () => {
  return;
};
require.extensions['.css'] = () => {
  return;
};

const VENDOR_LIBS = [
  'react', 'react-dom', 'react-redux', 'redux', 'rxjs'
];

module.exports = {
  context,
  entry:  {
    bundle: [
      'babel-polyfill',
      './js/index.js'
    ],
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.resolve(__dirname, 'build/js'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    publicPath: '/build/js/'
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        filename: './index.html',
      template: path.resolve(__dirname, 'index.html')
      }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ],
  resolve: {
        extensions: ['.js', '.jsx', '.css'],
        modules: [
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
    { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/, 
      loader: require.resolve("file-loader") + "?name=../[path][name].[ext]"},
    {   
        test: /\.js$/,
        include: path.resolve(__dirname, 'js'),
        loader: 'babel-loader',
        // presets: ['es2015', 'react'],
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