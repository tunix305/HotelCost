import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi"; // <-- Añadido

// PrimeVue
import PrimeVue from "primevue/config";
import Galleria from "primevue/galleria";
import Avatar from "primevue/avatar";

// Estilos necesarios
import "@mdi/font/css/materialdesignicons.css"; // <-- Añadido para que los íconos mdi funcionen
import "primeicons/primeicons.css"; // PrimeIcons

// Configurar Vuetify con iconos mdi
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi", // <-- Usar mdi por defecto
    aliases,
    sets: { mdi },
  },
});

// Crear y montar la app
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(PrimeVue);

// Registrar componentes de PrimeVue globalmente
app.component("PvAvatar", Avatar);
app.component("PrimeGalleria", Galleria);

app.mount("#app");
