const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  configureWebpack: {
    mode: 'production',
    devServer: {
      disableHostCheck: true
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    },
    performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  }
}