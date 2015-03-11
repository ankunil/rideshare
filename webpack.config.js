module.exports = {
  entry: './app.js',
  output: {
    filename: './public/js/bundle.js'
  },
  resolve:{
    root: "/Users/Serriph/projects/rideshare"
  },
  devtool: "eval",
  debug: true,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  }
};
