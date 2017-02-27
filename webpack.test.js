module.exports = {
  output: {
    // YOU NEED TO SET libraryTarget: 'commonjs2'
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules=true'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          // presets: ['es2015', 'react'],
          query: {
            plugins: [
              'transform-react-jsx',
              ['react-css-modules']
            ]
          }
        }
      }
    ],
  },
};