const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: process.env.NODE_ENV !== 'production', // Lint solo en desarrollo

  // Configuración crítica para GitHub Pages
  publicPath: process.env.NODE_ENV === 'production'
    ? '/HotelCost/' // Ruta base en producción (nombre de tu repositorio)
    : '/', // Ruta base en desarrollo

  outputDir: 'docs', // Carpeta de salida para GitHub Pages

  // Configuración de assets
  chainWebpack: config => {
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.limit = 4096; // Tamaño límite para inline (4KB)
        options.fallback = {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            publicPath: process.env.NODE_ENV === 'production'
              ? '/HotelCost/'
              : '/'
          }
        };
        return options;
      });
  },

  // Configuración del servidor de desarrollo
  devServer: {
    hot: true,
    open: true,
    static: {
      directory: path.join(__dirname, 'public')
    },
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },

  // Opciones de Vuetify
  pluginOptions: {
    vuetify: {
      // Configuración específica de Vuetify si es necesaria
    }
  },

  // Opcional: Configuración para generar reportes de bundle
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxAssetSize: 512000, // 512KB
      maxEntrypointSize: 512000 // 512KB
    }
  }
});