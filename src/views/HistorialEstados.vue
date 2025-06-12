<template>
  <v-app>
    <v-app-bar app color="#1a1a1a" dark>
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <h2 class="white--text text-h6 font-weight-bold">Historial de Estados</h2>
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
            class="transparent-table"
            no-data-text="No se encontraron registros"
          ></v-data-table>
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
  { text: 'Número de Habitación', value: 'numero' },
  { text: 'Estado', value: 'estado' },
  { text: 'Fecha de Cambio', value: 'fecha' },
];

const cargarHistorial = async () => {
  try {
    const { data } = await axios.get('https://hotelcost.somee.com/api/Habitaciones/HistorialEstados');
    historialEstados.value = data.map(e => ({
      numero: e.numero,
      estado: e.estado,
      fecha: new Date(e.fecha).toLocaleString('es-MX')
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
  background-color: #22cbc3;
  min-height: 100vh;
  padding-top: 100px;
}

.transparent-table {
  background-color: transparent !important;
}
.transparent-table >>> td,
.transparent-table >>> th {
  color: black;
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