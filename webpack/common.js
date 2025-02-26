const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const sharp = require("sharp");
const srcDir = path.join(__dirname, "..", "src");
const distDir = path.join(__dirname, "..", "dist");

module.exports = {
  entry: {
    background: path.join(srcDir, "Background", "index.ts"),
    content_script: path.join(srcDir, "ContentScripts", "index.ts"),
    options: path.join(srcDir, "Ui", "options", "options.tsx"),
  },
  output: {
    path: distDir,
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": srcDir,
    },
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(process.cwd(), "dist/**/*")],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new HtmlWebpackPlugin({
      template: path.join(srcDir, "Ui", "options", "options.html"),
      filename: path.join(distDir, "options.html"),
      chunks: ["options"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, "..", "public", "icon.png"),
          to: path.join(distDir, "assets", "icon16.png"),
          transform: async (content) => {
            return await sharp(content).resize(16, 16).toBuffer();
          },
        },
        {
          from: path.join(__dirname, "..", "public", "icon.png"),
          to: path.join(distDir, "assets", "icon32.png"),
          transform: async (content) => {
            return await sharp(content).resize(32, 32).toBuffer();
          },
        },
        {
          from: path.join(__dirname, "..", "public", "icon.png"),
          to: path.join(distDir, "assets", "icon48.png"),
          transform: async (content) => {
            return await sharp(content).resize(48, 48).toBuffer();
          },
        },
        {
          from: path.join(__dirname, "..", "public", "icon.png"),
          to: path.join(distDir, "assets", "icon128.png"),
          transform: async (content) => {
            return await sharp(content).resize(128, 128).toBuffer();
          },
        },
        {
          from: path.join(__dirname, "..", "manifest.json"),
          to: path.join(__dirname, "..", "dist"),
          force: true,
          transform: function (content, path) {
            return Buffer.from(
              JSON.stringify(
                {
                  description: process.env.npm_package_description,
                  version: process.env.npm_package_version,

                  ...JSON.parse(content.toString()),
                  icons: {
                    16: "assets/icon16.png",
                    32: "assets/icon32.png",
                    48: "assets/icon48.png",
                    128: "assets/icon128.png",
                  },
                },
                null,
                "\t"
              )
            );
          },
        },

        {
          from: path.join(__dirname, "..", "public", "icon.png"),
          to: path.join(distDir, "assets", "icon.png"),
        },
      ],
    }),
  ],
};
