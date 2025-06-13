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
            :items-per-page="10"
          >
            <template #header="{ props: { headers } }">
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header.text" class="text-left">
                    {{ header.text }}
                  </th>
                </tr>
              </thead>
            </template>
            
            <template #item.estado="{ item }">
              <v-chip :color="getColorEstado(item.estado)" small dark>
                {{ item.estado }}
              </v-chip>
            </template>
            <template #item.fechaInicio="{ item }">
              {{ formatFechaCompleta(item.fechaInicio) }}
            </template>
            <template #item.fechaFin="{ item }">
              {{ formatFechaCompleta(item.fechaFin) }}
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

const headers = [
  { text: 'Habitación', value: 'habitacion', align: 'start', sortable: true },
  { text: 'Estado', value: 'estado', sortable: true },
  { text: 'Fecha de inicio', value: 'fechaInicio', sortable: true },
  { text: 'Fecha de salida', value: 'fechaFin', sortable: true },
  { text: 'Motivo', value: 'motivo', sortable: true },
  { text: 'Responsable', value: 'responsable', sortable: true },
];

const historialEstados = ref([]);

const formatFechaCompleta = (fecha) => {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const getColorEstado = (estado) => {
  const e = estado?.toLowerCase() || '';
  if (e.includes('mantenimiento')) return 'orange';
  if (e.includes('ocupada')) return 'red';
  if (e.includes('limpieza')) return 'blue';
  return 'grey';
};

const cargarHistorial = async () => {
  try {
    const { data } = await axios.get('https://www.hotelcost.somee.com/api/Habitaciones/HistorialCambios');
    historialEstados.value = data
      .filter(e =>
        ['ocupada', 'limpieza', 'mantenimiento'].includes(e.estado_Nuevo?.toLowerCase())
      )
      .map(e => ({
        habitacion: e.numero_Habitacion || 'N/A',
        estado: e.estado_Nuevo || 'N/A',
        fechaInicio: e.fecha_Cambio,
        fechaFin: e.fecha_Cambio,
        motivo: `Cambio desde ${e.estado_Anterior || 'desconocido'}`,
        responsable: e.usuario_Modificacion || 'No especificado'
      }))
      .sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin));
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

.estado-table >>> thead tr th {
  font-weight: bold !important;
  background-color: #f5f5f5 !important;
  position: sticky;
  top: 0;
  z-index: 1;
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