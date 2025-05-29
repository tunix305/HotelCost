<template>
  <v-app>
    <!-- Encabezado -->
    <v-app-bar app color="#1a1a1a" dark>
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="60" />
        <h1 class="white--text text-h6 font-weight-bold mb-0">
          Historial de Cambios de Habitaciones
        </h1>
        <v-btn class="btn-regresar" @click="goBack">REGRESAR</v-btn>
      </v-container>
    </v-app-bar>

    <!-- Tabla de historial -->
    <v-main class="historial-container">
      <v-container>
        <v-card elevation="8" class="pa-4">
          <div v-if="historial.length === 0" class="text-center text-grey--text">
            No hay datos en el historial.
          </div>
          <v-data-table
            v-else
            :headers="headers"
            :items="historial"
            class="elevation-1"
            dense
            :sort-by="['fecha_Cambio']"
            :sort-desc="[true]"
          >
            <template #item.fecha_Cambio="{ item }">
              {{ formatDate(item.fecha_Cambio) }}
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HistorialHabitacionesView',
  data() {
    return {
      historial: [],
      headers: [
        { text: 'ID', value: 'id_Habitacion' },
        { text: 'Habitación', value: 'numero_Habitacion' },
        { text: 'Estado Anterior', value: 'estado_Anterior' },
        { text: 'Estado Nuevo', value: 'estado_Nuevo' },
        { text: 'Fecha de Cambio', value: 'fecha_Cambio' },
        { text: 'Modificado por', value: 'usuario_Modificacion' }
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        path: '/habitaciones',
        query: {
          username: this.$route.query.username,
          role: this.$route.query.role,
        },
      });
    },
    async cargarHistorial() {
      try {
        const res = await axios.get('https://localhost:7239/api/Habitaciones/HistorialCambios');
        console.log("✅ Datos recibidos:", res.data);
        this.historial = res.data;
      } catch (err) {
        console.error('❌ Error al cargar historial:', err);
      }
    },
    formatDate(fecha) {
      const date = new Date(fecha);
      return isNaN(date.getTime())
        ? 'Fecha inválida'
        : date.toLocaleString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
    }
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
</style>
