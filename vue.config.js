const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
      }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  },
  devServer: {
    port: 8008,
    host: '0.0.0.0',
    allowedHosts: 'all'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  css: {
    extract: true,
    sourceMap: false
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/template.html',
      filename: 'index.html'
    }
  }
}) 