<template>
  <v-app>
    <v-app-bar app color="#1a1a1a" dark>
      <v-toolbar-title>Historial Completo de Estados</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="goToHome" class="regresar-btn">REGRESAR</v-btn>
    </v-app-bar>

    <v-main class="estado-historial-container">
      <v-container>
        <v-card elevation="8" class="pa-4">
          <v-data-table
            :headers="headers"
            :items="historialEstados"
            dense
            class="elevation-1 estado-table"
            no-data-text="No se encontraron registros"
          >
            <template v-slot:item.estado="{ item }">
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
  { text: 'Habitación', value: 'habitacion' },
  { text: 'Estado', value: 'estado' },
  { text: 'Fecha de Inicio', value: 'fecha_inicio' },
  { text: 'Fecha de Salida', value: 'fecha_salida' },
  { text: 'Motivo', value: 'motivo' },
  { text: 'Responsable', value: 'responsable' },
];

const historialEstados = ref([]);

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
        fecha_inicio: e.fecha_Cambio,
        fecha_salida: e.fecha_Cambio,
        motivo: `Cambio desde ${e.estado_Anterior || 'desconocido'}`,
        responsable: e.usuario_Modificacion || 'No especificado'
      }));
  } catch (error) {
    console.error('❌ Error al cargar historial:', error);
  }
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

onMounted(() => {
  cargarHistorial();
});
</script>

<style scoped>
.estado-historial-container {
  background-color: #f0f0f0;
  min-height: 100vh;
  padding-top: 64px;
}

.regresar-btn {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
}
</style>
