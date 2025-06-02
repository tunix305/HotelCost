<template>
  <v-app>
    <!-- Encabezado con App-Bar -->
    <v-app-bar app color="#1a1a1a" dark>
      <v-container fluid class="d-flex align-center justify-space-between px-4">

        <!-- 1) Icono hamburguesa (visible solo en móvil) -->
        <v-app-bar-nav-icon
          class="d-sm-none d-md-none"
          @click="drawer = true"
        />

        <!-- 2) Logo y Título (siempre visibles) -->
        <v-row class="align-center flex-grow-1">
          <v-col cols="auto" class="d-flex align-center">
            <v-img
              src="@/assets/logotiopo.png"
              alt="Logo"
              max-width="60"
              max-height="60"
            />
          </v-col>
          <v-col cols="auto" class="d-flex align-center">
            <h1 class="white--text text-h6 font-weight-bold mb-0">
              Historial de Habitaciones Reservadas
            </h1>
          </v-col>
        </v-row>

        <!-- 3) Botón “REGRESAR” solo en desktop -->
        <v-row class="d-none d-sm-flex align-center">
          <v-btn class="btn-regresar" @click="goBack">
            REGRESAR
          </v-btn>
        </v-row>

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
            <!-- Personalización de columnas -->
            <template #item.id_Habitacion="{ item }">
              <span class="font-weight-bold">ID:</span> {{ item.id_Habitacion || 'N/A' }}
            </template>
            <template #item.numero_Habitacion="{ item }">
              <span class="font-weight-bold">Habitación:</span> {{ item.numero_Habitacion || 'N/A' }}
            </template>
            <template #item.fecha_Entrada="{ item }">
              <div>
                <span class="font-weight-bold">Entrada:</span><br>
                {{ formatDate(item.fecha_Entrada) || 'N/A' }}
              </div>
            </template>
            <template #item.fecha_Salida="{ item }">
              <div>
                <span class="font-weight-bold">Salida:</span><br>
                {{ formatDate(item.fecha_Salida) || 'N/A' }}
              </div>
            </template>
            <template #item.fecha_Cambio="{ item }">
              <div>
                <span class="font-weight-bold">Reserva:</span><br>
                {{ formatDate(item.fecha_Cambio) || 'N/A' }}
              </div>
            </template>
            <template #item.usuario_Modificacion="{ item }">
              <span class="font-weight-bold">Usuario:</span> {{ item.usuario_Modificacion || 'N/A' }}
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
        { text: "ID Habitación", value: "id_Habitacion", width: "120px" },
        { text: "Número", value: "numero_Habitacion", width: "120px" },
        { text: "Fechas de Estancia", value: "fecha_Entrada", width: "200px" },
        { text: "Fecha de Salida", value: "fecha_Salida", width: "200px" },
        { text: "Fecha de Reserva", value: "fecha_Cambio", width: "200px" },
        { text: "Usuario", value: "usuario_Modificacion", width: "150px" },
      ],
      drawer: false, // controla el estado del drawer (menú en móvil)
    };
  },
  methods: {
    // Método para volver a la lista de habitaciones
    goBack() {
      this.$router.push({
        path: "/habitaciones",
        query: {
          username: this.$route.query.username,
          role: this.$route.query.role,
        },
      });
    },
    // Cierra el drawer y luego navega para evitar solapamiento visual
    handleDrawerBack() {
      this.drawer = false;
      // Pequeño timeout para que el drawer tenga tiempo de cerrarse visualmente
      setTimeout(() => {
        this.goBack();
      }, 200);
    },
    // Carga los datos del historial desde tu API
    async cargarHistorial() {
      try {
        const res = await axios.get(
          "https://localhost:7239/api/Reservacion/HistorialReservas"
        );
        console.log("Datos recibidos:", res.data);
        this.historial = res.data.map((item) => ({
          ...item,
          // Aseguramos que los campos existan (evitamos undefined)
          id_Habitacion: item.id_Habitacion || "N/A",
          numero_Habitacion: item.numero_Habitacion || "N/A",
          usuario_Modificacion:
            item.usuario_Modificacion || "Usuario no especificado",
        }));
      } catch (err) {
        console.error("❌ Error al cargar historial:", err);
      }
    },
    // Formatea fechas de manera legible en español (México)
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
</style>
