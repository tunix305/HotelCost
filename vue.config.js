const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  // 🚫 Desactiva el lint al guardar
  lintOnSave: false,

  // ✅ RUTA PÚBLICA RELATIVA (importante para que cargue bien en GitHub Pages)
  publicPath: './',

  // ✅ CAMBIA LA SALIDA DE `dist/` A `docs/`
  outputDir: 'docs',

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
