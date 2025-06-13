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
            hide-default-header
          >
            <template #header>
              <thead class="v-data-table-header">
                <tr>
                  <th v-for="header in headers" :key="header.text" 
                      :style="{ width: header.width, textAlign: header.align || 'left' }"
                      class="header-cell">
                    {{ header.text }}
                  </th>
                </tr>
              </thead>
            </template>

            <template #item.fechaInicio="{ item }">
              {{ formatFechaImagen(item.fechaInicio) }}
            </template>

            <template #item.fechaFin="{ item }">
              {{ formatFechaImagen(item.fechaFin) }}
            </template>

            <template #item.estado="{ item }">
              <v-chip :color="getColorEstado(item.estado)" small dark>
                {{ item.estado }}
              </v-chip>
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
  { text: 'ID', value: 'id', width: '80px', align: 'center' },
  { text: 'Habitación', value: 'habitacion', width: '100px', align: 'center' },
  { text: 'Fecha Inicio', value: 'fechaInicio', width: '180px' },
  { text: 'Fecha Fin', value: 'fechaFin', width: '180px' },
  { text: 'Motivo', value: 'motivo', width: '250px' },
  { text: 'Estado', value: 'estado', width: '140px', align: 'center' },
  { text: 'Responsable', value: 'responsable', width: '150px' },
];

const historialEstados = ref([]);

const formatFechaImagen = (fecha) => {
  if (!fecha) return 'N/A';
  const date = new Date(fecha);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
  const formattedHours = hours % 12 || 12;
  
  return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
};

const getColorEstado = (estado) => {
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes('mantenimiento')) return 'orange';
  if (estadoLower.includes('finalizado')) return 'green';
  if (estadoLower.includes('ocupada')) return 'red';
  if (estadoLower.includes('limpieza')) return 'blue';
  return 'grey';
};

const cargarHistorial = async () => {
  try {
    const { data } = await axios.get('https://hotelcost.somee.com/api/Habitaciones/HistorialEstados');
    historialEstados.value = data.map(e => ({
      id: e.id,
      habitacion: e.habitacion || e.numero || 'N/A',
      fechaInicio: e.fechaInicio || e.fecha_inicio,
      fechaFin: e.fechaFin || e.fecha_fin,
      motivo: e.motivo || 'Sin motivo',
      estado: e.estado || 'Desconocido',
      responsable: e.responsable || e.usuario || 'No especificado',
    }));
  } catch (error) {
    console.error('❌ Error al cargar historial de estados:', error);
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
  padding-top: 80px;
}

.estado-table {
  background-color: white !important;
  border-radius: 8px;
  border-collapse: separate;
  border-spacing: 0;
}

.estado-table >>> .v-data-table-header {
  background-color: #f5f5f5 !important;
}

.estado-table >>> .header-cell {
  font-weight: bold !important;
  font-size: 14px !important;
  padding: 12px 16px !important;
  background-color: #f5f5f5 !important;
  position: sticky;
  top: 0;
  z-index: 2;
}

.estado-table >>> td {
  font-size: 13px;
  padding: 8px 16px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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

.v-card {
  border-radius: 12px;
}
</style>