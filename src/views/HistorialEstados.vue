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

const headers = [
  { text: 'ID', value: 'id', width: '80px' },
  { text: 'Habitación', value: 'habitacion', width: '120px' },
  { text: 'Fecha Inicio', value: 'fechaInicio', width: '180px' },
  { text: 'Fecha Fin', value: 'fechaFin', width: '180px' },
  { text: 'Motivo', value: 'motivo', width: '250px' },
  { text: 'Estado', value: 'estado', width: '140px' },
  { text: 'Responsable', value: 'responsable', width: '200px' },
];

const historialEstados = ref([]);

const formatFechaCompleta = (fecha) => {
  if (!fecha) return 'N/A';
  const options = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: true,
  };
  return new Date(fecha).toLocaleString('es-MX', options);
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
    const { data } = await axios.get('https://www.hotelcost.somee.com/api/Habitaciones/HistorialCambios');

    historialEstados.value = data
      .filter(e => ['ocupada', 'limpieza', 'mantenimiento'].some(f => e.estado_Nuevo.toLowerCase().includes(f)))
      .map(e => ({
        id: e.id_Historial,
        habitacion: e.numero_Habitacion || 'N/A',
        fechaInicio: null, // no viene del backend
        fechaFin: e.fecha_Cambio,
        motivo: `Cambio desde ${e.estado_Anterior}`,
        estado: e.estado_Nuevo,
        responsable: e.usuario_Modificacion || 'No especificado',
      }))
      .sort((a, b) => new Date(b.fechaFin) - new Date(a.fechaFin));
  } catch (error) {
    console.error('❌ Error al cargar historial de cambios:', error);
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