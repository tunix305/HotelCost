<template>
  <v-app>
    <!-- Encabezado con App-Bar -->
    <v-app-bar app color="#1a1a1a" dark height="auto" class="navbar">
  <v-container fluid class="d-flex align-center justify-space-between flex-wrap px-6">
    <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="50" class="logo-img" />
    <h1 class="navbar-title white--text text-center">Historial de Habitaciones Reservadas</h1>
    <v-btn class="regresar-btn" @click="goBack">REGRESAR</v-btn>
  </v-container>
</v-app-bar>


    <!-- Drawer (solo en móvil) -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      class="d-sm-flex d-md-flex d-lg-none"
    >
      <v-list nav dense>
        <!-- Mostrar un encabezado en el drawer con logo y texto opcional -->
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="@/assets/logotiopo.png" alt="Logo" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              Menú
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="my-2" />

        <!-- Única opción: Regresar -->
        <v-list-item @click="handleDrawerBack">
          <v-list-item-icon>
            <v-icon>mdi-arrow-left-bold</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Regresar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal: Tabla de historial -->
    <v-main class="historial-container">
      <v-container>
        <v-card elevation="8" class="pa-4">
          <h2 class="text-h6 font-weight-bold text-center mb-4">
            Historial de Habitaciones Reservadas
          </h2>
          <div v-if="historial.length === 0" class="text-center text-grey--text">
            No hay datos en el historial.
          </div>

         <v-data-table
  v-else
  :headers="headers"
  :items="historial"
  class="elevation-1 historial-table"
  dense
  :sort-by="['fecha_Cambio']"
  :sort-desc="[true]"
  :items-per-page="10"
>
  <template #item.fecha_Cambio="{ item }">
    <div>
      {{ formatDate(item.fecha_Cambio) }}
    </div>
  </template>
</v-data-table>

        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "HistorialHabitacionesView",
  data() {
    return {
      historial: [],
      headers: [
        { text: "ID Historial", value: "id_Historial" },
        { text: "ID Habitación", value: "id_Habitacion" },
        { text: "Número", value: "numero_Habitacion" },
        { text: "Estado Anterior", value: "estado_Anterior" },
        { text: "Estado Nuevo", value: "estado_Nuevo" },
        { text: "Fecha de Cambio", value: "fecha_Cambio" },
        { text: "Usuario", value: "usuario_Modificacion" },
      ],
      drawer: false,
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "/habitaciones",
        query: {
          username: this.$route.query.username,
          role: this.$route.query.role,
        },
      });
    },
    handleDrawerBack() {
      this.drawer = false;
      setTimeout(() => {
        this.goBack();
      }, 200);
    },
    async cargarHistorial() {
      try {
        const res = await axios.get(
          "https://www.hotelcost.somee.com/api/Habitaciones/HistorialCambios"
        );
        this.historial = res.data;
      } catch (err) {
        console.error("❌ Error al cargar historial:", err);
      }
    },
    formatDate(fecha) {
      if (!fecha) return "N/A";
      const date = new Date(fecha);
      return isNaN(date.getTime())
        ? "Fecha inválida"
        : date.toLocaleString("es-MX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
    },
  },
  mounted() {
    this.cargarHistorial();
  },
};
</script>

<style scoped>
.historial-container {
  background-color: #e0f7fa;
  min-height: calc(100vh - 100px);
  padding: 100px 0 20px;
}

/* Botón REGRESAR (estilo desktop) */
.btn-regresar {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
  font-weight: bold;
  padding: 10px 25px;
  border-radius: 999px;
  text-transform: uppercase;
  font-size: 0.9rem;
  box-shadow: none;
  transition: 0.3s ease;
}
.btn-regresar:hover {
  background-color: #ffeb3b !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Ajustes para la tabla de historial */
.historial-table {
  font-size: 14px;
}
/* Aplicamos estilo a los <th> dentro del data-table */
.historial-table >>> th {
  font-weight: bold !important;
  background-color: #f5f5f5 !important;
  color: #1a1a1a !important;
}
/* Y estilo a los td */
.historial-table >>> td {
  padding: 8px 16px !important;
  vertical-align: top !important;
}

/* Pequeño override para que el icono de menú no se “coma” mucho margen */
.v-app-bar-nav-icon {
  margin-left: 8px;
  color: white;
}
.navbar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  flex: 1;
}

.logo-img {
  max-width: 50px;
}

@media (max-width: 600px) {
  .navbar-title {
    font-size: 1rem;
    margin: 8px 0;
  }

  .regresar-btn {
  background-color: #fbc02d !important;
  color: #1a1a1a !important;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px;
  padding: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.regresar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}


  .logo-img {
    max-width: 40px;
  }
}

</style>
