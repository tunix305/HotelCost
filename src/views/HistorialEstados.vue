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
            <template v-slot:header="{ props: { headers } }">
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header.text" class="text-left px-2">
                    <span class="font-weight-bold">{{ header.text }}</span>
                  </th>
                </tr>
              </thead>
            </template>
            
            <template v-slot:item="{ item }">
              <tr>
                <td class="px-2">{{ item.habitacion }}</td>
                <td class="px-2">
                  <v-chip :color="getColorEstado(item.estado)" small dark>
                    {{ item.estado }}
                  </v-chip>
                </td>
                <td class="px-2">{{ formatFechaCompleta(item.fechaInicio) }}</td>
                <td class="px-2">{{ formatFechaCompleta(item.fechaFin) }}</td>
                <td class="px-2">{{ item.motivo }}</td>
                <td class="px-2">{{ item.responsable }}</td>
              </tr>
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
  { text: 'Habitación', value: 'habitacion', width: '120px' },
  { text: 'Estado', value: 'estado', width: '130px' },
  { text: 'Fecha de inicio', value: 'fechaInicio', width: '180px' },
  { text: 'Fecha de salida', value: 'fechaFin', width: '180px' },
  { text: 'Motivo', value: 'motivo', width: '280px' },
  { text: 'Responsable', value: 'responsable', width: '180px' },
];

const historialEstados = ref([
  {
    habitacion: '101',
    estado: 'Ocupada',
    fechaInicio: '2025-06-13T00:04:00',
    fechaFin: '2025-06-13T00:04:00',
    motivo: 'Cambio desde Ocupada',
    responsable: 'manuel'
  }
  // Más datos pueden agregarse aquí
]);

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

const goToHome = () => {
  router.push('/home');
};

// onMounted(() => {
//   cargarHistorial();
// });
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
  width: 100%;
}

.estado-table >>> thead tr th {
  background-color: #f5f5f5 !important;
  position: sticky;
  top: 0;
  z-index: 1;
  font-weight: bold;
  font-size: 0.875rem;
}

.estado-table >>> tbody tr td {
  font-size: 0.8125rem;
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