<template>
  <v-app>
    <!-- Encabezado -->
    <v-app-bar app color="#1a1a1a" dark>
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="60" />
        <h1 class="white--text text-h6 font-weight-bold mb-0">
          Historial de Habitaciones Reservadas
        </h1>
        <v-btn class="btn-regresar" @click="goBack">REGRESAR</v-btn>
      </v-container>
    </v-app-bar>

    <!-- Tabla de historial -->
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
            <!-- Personalización de cómo se muestran los datos -->
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
import axios from 'axios';

export default {
  name: 'HistorialHabitacionesView',
  data() {
    return {
      historial: [],
      headers: [
        { text: 'ID Habitación', value: 'id_Habitacion', width: '120px' },
        { text: 'Número', value: 'numero_Habitacion', width: '120px' },
        { text: 'Fechas de Estancia', value: 'fecha_Entrada', width: '200px' },
        { text: 'Fecha de Salida', value: 'fecha_Salida', width: '200px' },
        { text: 'Fecha de Reserva', value: 'fecha_Cambio', width: '200px' },
        { text: 'Usuario', value: 'usuario_Modificacion', width: '150px' }
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
        const res = await axios.get('https://localhost:7239/api/Reservacion/HistorialReservas');
        console.log('Datos recibidos:', res.data); // Para depuración
        this.historial = res.data.map(item => ({
          ...item,
          // Aseguramos que todos los campos existan
          id_Habitacion: item.id_Habitacion || 'N/A',
          numero_Habitacion: item.numero_Habitacion || 'N/A',
          usuario_Modificacion: item.usuario_Modificacion || 'Usuario no especificado'
        }));
      } catch (err) {
        console.error('❌ Error al cargar historial:', err);
      }
    },
    formatDate(fecha) {
      if (!fecha) return 'N/A';
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

.historial-table {
  font-size: 14px;
}

.historial-table >>> th {
  font-weight: bold !important;
  background-color: #f5f5f5 !important;
  color: #1a1a1a !important;
}

.historial-table >>> td {
  padding: 8px 16px !important;
  vertical-align: top !important;
}
</style>