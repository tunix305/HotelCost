<template>
  <v-app>
    <v-app-bar app color="#1a1a1a" dark>
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <h2 class="white--text text-h6 font-weight-bold">Historial Completo de Estados</h2>
        <v-btn class="regresar-btn" @click="goToHome">REGRESAR</v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="estado-historial-container">
      <v-container>
        <v-card elevation="8" class="pa-4">
          <h3 class="text-h6 text-center font-weight-bold mb-4">
            Habitaciones con estado Ocupada, Limpieza o Mantenimiento
          </h3>

          <v-data-table
            :headers="headers"
            :items="historialEstados"
            dense
            class="elevation-1 estado-table"
            no-data-text="No se encontraron registros"
          >
            <template #item.estado="{ item }">
              <v-chip :color="getColorEstado(item.estado)" small dark>
                {{ item.estado }}
              </v-chip>
            </template>
            <template #item.fecha_inicio="{ item }">
              {{ formatFecha(item.fecha_inicio) }}
            </template>
            <template #item.fecha_salida="{ item }">
              {{ formatFecha(item.fecha_salida) }}
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const historialEstados = ref([]);

const headers = [
  { text: 'Habitación', value: 'habitacion', width: '120px' },
  { text: 'Estado', value: 'estado', width: '120px' },
  { text: 'Fecha de inicio', value: 'fecha_inicio', width: '200px' },
  { text: 'Fecha de salida', value: 'fecha_salida', width: '200px' },
  { text: 'Motivo', value: 'motivo', width: '300px' },
  { text: 'Responsable', value: 'responsable', width: '180px' }
];

const getColorEstado = (estado) => {
  const colores = {
    'Ocupada': 'red',
    'Limpieza': 'blue',
    'Mantenimiento': 'orange',
    'Disponible': 'green',
    'Reservada': 'purple'
  };
  return colores[estado] || 'grey';
};

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  return isNaN(date.getTime())
    ? 'Fecha inválida'
    : date.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
};

const cargarHistorial = async () => {
  try {
    // Aquí deberías consumir un endpoint nuevo o combinado que traiga toda esta info
    const { data } = await axios.get('https://hotelcost.somee.com/api/Habitaciones/HistorialEstadosYTareas');

    historialEstados.value = data.map(e => ({
      habitacion: e.numero_habitacion || 'N/A',
      estado: e.estado || 'N/A',
      fecha_inicio: e.fecha_inicio,
      fecha_salida: e.fecha_salida,
      motivo: e.descripcion || 'Sin motivo',
      responsable: e.usuario_asignado || 'Sin asignar'
    }));
  } catch (error) {
    console.error('❌ Error al cargar historial:', error);
  }
};

const goToHome = () => {
  router.push('/home');
};

onMounted(() => {
  cargarHistorial();
});
</script>

<style scoped>
.estado-historial-container {
  background-color: #e0f7fa;
  min-height: 100vh;
  padding-top: 100px;
}

.estado-table {
  background-color: white !important;
  border-radius: 8px;
}

.estado-table >>> th {
  font-weight: bold !important;
  background-color: #f5f5f5 !important;
}

.regresar-btn {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
  font-weight: bold;
  border-radius: 999px;
  padding: 10px 25px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.regresar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}
</style>