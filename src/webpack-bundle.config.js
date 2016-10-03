const path = require("path");
const webpack = require("webpack");
module.exports = {
  devtool: false,
  context: path.join(__dirname, "../dist/angular-http-mock"),
  entry: "./index",
  output: {
    path: path.join(__dirname, "../dist/angular-http-mock/bundles/"),
    filename: "angular-http-mock.umd.js",
    library: ["ng", "httpMock"],
    libraryTarget: "umd"
  },
  externals: {
    '@angular/core': 'ng.core',
    '@angular/core/testing': 'ng.core.testing',
    '@angular/http': 'ng.http',
    '@angular/http/testing': 'ng.http.testing',
    '@angular/compiler': 'ng.compiler',
    '@angular/platform-browser': 'ng.platformBrowser',
    'rxjs/Observable': 'Rx',
    'rxjs/Subject': 'Rx'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
}
