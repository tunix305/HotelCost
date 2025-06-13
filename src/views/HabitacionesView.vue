<template>
  <v-app>
    <!-- NAVBAR -->
    <v-app-bar app color="#1a1a1a" dark height="auto" class="navbar">
      <v-container fluid class="d-flex align-center justify-space-between flex-wrap px-6">
        <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="60" class="logo-img" />
        <h1 class="navbar-title white--text text-center">Gestión de Habitaciones</h1>
        <div class="d-flex align-center flex-wrap justify-end mt-2 mt-md-0">
          <v-btn class="btn-historial mr-2" @click="verHistorial">HISTORIAL DE CAMBIOS</v-btn>
          <v-btn class="btn-regresar" @click="goToHome">REGRESAR</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- CONTENIDO PRINCIPAL -->
    <v-main class="habitaciones-container">
      <v-container>
        <v-card elevation="8" class="pa-4">
          <h3 class="text-h6 text-center font-weight-bold mb-4">
            Historial de Habitaciones en Mantenimiento
          </h3>

          <v-data-table
            :headers="headers"
            :items="historial"
            class="historial-table"
            dense
            no-data-text="No se encontraron registros"
          >
            <template #item.estado="{ item }">
              <span :class="['estado', getEstadoColor(item.estado)]">{{ item.estado }}</span>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const username = route.query.username || '';
const role = route.query.role || '';

const historial = ref([]);

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Habitación', value: 'habitacion' },
  { text: 'Fecha Inicio', value: 'fechaInicio' },
  { text: 'Fecha Fin', value: 'fechaFin' },
  { text: 'Motivo', value: 'motivo' },
  { text: 'Estado', value: 'estado' },
  { text: 'Responsable', value: 'responsable' },
];

const getEstadoColor = (estado) => {
  if (estado.includes('mantenimiento')) return 'color-naranja';
  if (estado.includes('Finalizado')) return 'color-gris';
  return '';
};

const formatFecha = (fechaRaw) => {
  const fecha = new Date(fechaRaw);
  return isNaN(fecha.getTime())
    ? 'Fecha inválida'
    : fecha.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
};

const cargarHistorial = async () => {
  try {
    const { data } = await axios.get('https://hotelcost.somee.com/api/Habitaciones/HistorialEstados');
    historial.value = data.map(e => ({
      id: e.id || 'N/A',
      habitacion: e.numero || 'N/A',
      fechaInicio: formatFecha(e.fechaInicio),
      fechaFin: formatFecha(e.fechaFin),
      motivo: e.motivo || 'N/A',
      estado: e.estado || 'N/A',
      responsable: e.usuario || 'N/A'
    }));
  } catch (error) {
    console.error('❌ Error al cargar historial:', error);
  }
};

const goToHome = () => {
  router.push({
    path: '/home',
    query: {
      username,
      role
    }
  });
};

const verHistorial = () => {
  router.push({
    path: '/historial-cambios',
    query: {
      username,
      role
    }
  });
};

onMounted(() => {
  cargarHistorial();
});
</script>

<style scoped>
.habitaciones-container {
  background-color: #22cbc3;
  min-height: calc(100vh - 100px);
  padding: 100px 0 20px;
}

.historial-table {
  background: white;
  border-radius: 12px;
}

.estado {
  font-weight: bold;
}

.color-naranja {
  color: #f57c00;
}

.color-gris {
  color: #757575;
}

.navbar {
  background-color: #1a1a1a;
}

.navbar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  flex: 1;
}

.logo-img {
  max-width: 60px;
}

.btn-regresar {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
  font-weight: bold;
  padding: 10px 25px;
  border-radius: 999px;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: 0.3s ease;
}

.btn-regresar:hover {
  background-color: #ffeb3b !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-historial {
  background-color: #ffffff !important;
  color: #1a1a1a !important;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 999px;
  text-transform: uppercase;
  font-size: 0.9rem;
  transition: 0.3s ease;
}

.btn-historial:hover {
  background-color: #fdd835 !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .navbar-title {
    font-size: 1rem;
    margin: 8px 0;
  }

  .logo-img {
    max-width: 45px;
  }

  .btn-historial,
  .btn-regresar {
    font-size: 0.7rem !important;
    padding: 6px 12px !important;
    min-width: unset;
    margin-top: 6px;
  }
}
</style>
