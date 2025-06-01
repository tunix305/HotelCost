// vue.config.js

const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  // Transpila dependencias que puedan contener sintaxis moderna
  transpileDependencies: true,

  // Solo linting en desarrollo, desactiva en producción
  lintOnSave: process.env.NODE_ENV !== "production",

  // Ajusta la ruta base según el entorno:
  // - En producción (GitHub Pages) usará '/HotelCost/'
  // - En desarrollo usará '/'
  publicPath:
    process.env.NODE_ENV === "production" ? "/HotelCost/" : "/",

  // Carpeta de salida para los archivos estáticos (GitHub Pages leerá de "docs/")
  outputDir: "docs",

  // Modificación de reglas internas de webpack para imágenes
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .tap(function (_options) {
        // Convierte _options undefined en un objeto vacío
        const options = _options || {};
        // Si el archivo es menor a 4 KB, lo convierte en base64 inline
        options.limit = 4096;
        // De lo contrario, usa file-loader para copiarlo a /img/ con hash y con publicPath adecuado
        options.fallback = {
          loader: "file-loader",
          options: {
            name: "img/[name].[hash:8].[ext]",
            publicPath:
              process.env.NODE_ENV === "production" ? "/HotelCost/" : "/",
          },
        };
        return options;
      });
  },

  // Configuración para el servidor de desarrollo local
  devServer: {
    hot: true,
    open: true,
    static: {
      directory: path.join(__dirname, "public"),
    },
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },

  // Opciones específicas para Vuetify (si utilizas Vuetify)
  pluginOptions: {
    vuetify: {
      // Aquí podrías poner configuraciones adicionales de Vuetify si las necesitas
    },
  },

  // Opcional: ajustar warnings de tamaño de bundle
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === "production" ? "warning" : false,
      maxAssetSize: 512000, // 500 KB
      maxEntrypointSize: 512000, // 500 KB
    },
  },
});
