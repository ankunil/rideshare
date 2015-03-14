module.exports = {
  entry: './app.js',
  output: {
    filename: './public/js/bundle.js'
  },
  resolve:{
    root: "/Users/Serriph/projects/rideshare"
  },

  devtool: "eval",
  debug: false,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  }
};
