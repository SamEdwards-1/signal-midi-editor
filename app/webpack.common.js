const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const Dotenv = require("dotenv-webpack")

module.exports = {
  context: __dirname,
  entry: {
    browserMain: "./src/index.tsx",
    browserAuth: "./src/auth/index.tsx",
    browserCommunity: "./src/community.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[chunkhash].js",
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf)$/,
        loader: "url-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new Dotenv({
      path: path.join(__dirname, "../.env"),
      systemvars: true,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: "edit.html",
      chunks: ["browserMain"],
      template: path.join(__dirname, "public", "edit.html"),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: "auth.html",
      chunks: ["browserAuth"],
      template: path.join(__dirname, "public", "auth.html"),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: "community.html",
      chunks: ["browserCommunity"],
      template: path.join(__dirname, "public", "community.html"),
    }),
  ],
}
