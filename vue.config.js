const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,   // Para que Vue CLI transpile dependencias si usan sintaxis no soportada
  lintOnSave: false,             // Desactiva ESLint al guardar (solo estilo/proyectos personales)

  // 📂 Hacer que todas las rutas internas (CSS, JS, imágenes) se generen como relativas
  //    en lugar de absolutas ("/js/..."), lo cual es imprescindible para GitHub Pages
  publicPath: './',

  // 📤 Indica que el resultado de "npm run build" se quiere en la carpeta "docs/"
  //    (GitHub Pages leerá directamente lo que haya en /docs)
  outputDir: 'docs',

  pluginOptions: {
    vuetify: {
      // (Aquí irían opciones específicas de Vuetify si las tuvieras)
    },
  },
});