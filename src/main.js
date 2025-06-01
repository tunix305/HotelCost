import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// PrimeVue
import PrimeVue from "primevue/config";
import Galleria from "primevue/galleria";
import Avatar from "primevue/avatar";

// Estilos
import "@mdi/font/css/materialdesignicons.css";
import "primeicons/primeicons.css";

// Configurar Vuetify
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});

// Crear la app
const app = createApp(App);

console.log("🟢 App iniciando...");

app.use(router);
app.use(vuetify);
app.use(PrimeVue);

// Registrar componentes PrimeVue globales
app.component("PvAvatar", Avatar);
app.component("PrimeGalleria", Galleria);

// Montar la app con control de errores
try {
  app.mount("#app");
  console.log("✅ App montada correctamente");
} catch (error) {
  console.error("❌ Error al montar la app:", error);
}
