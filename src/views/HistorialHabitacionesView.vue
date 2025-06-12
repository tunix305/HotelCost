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
          <div v-if="historial.length === 0" class="text-center text-grey">
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
            <template #item.id_Habitacion="{ item }">
              <span class="font-weight-bold">ID:</span> {{ item.id_Habitacion || 'N/A' }}
            </template>

            <template #item.numero_Habitacion="{ item }">
              <span class="font-weight-bold">Habitación:</span> {{ item.numero_Habitacion || 'N/A' }}
            </template>

            <template #item.estado_Cambio="{ item }">
              <v-chip :color="getEstadoColor(item.estado_Nuevo)" small>
                {{ item.estado_Anterior }} → {{ item.estado_Nuevo }}
              </v-chip>
            </template>

            <template #item.fecha_Entrada="{ item }">
              <div>
                <span class="font-weight-bold">Entrada:</span><br />
                {{
                  (item.estado_Anterior === 'Disponible' && item.estado_Nuevo === 'Ocupada') ||
                  (item.estado_Anterior === 'Reservada' && item.estado_Nuevo === 'Ocupada')
                    ? formatDate(item.fecha_Cambio)
                    : 'N/A'
                }}
              </div>
            </template>

            <template #item.fecha_Salida="{ item }">
              <div>
                <span class="font-weight-bold">Salida:</span><br />
                {{
                  item.estado_Anterior === 'Ocupada' && 
                  ['Disponible', 'Limpieza', 'Mantenimiento'].includes(item.estado_Nuevo)
                    ? formatDate(item.fecha_Cambio)
                    : 'N/A'
                }}
              </div>
            </template>

            <template #item.fecha_Cambio="{ item }">
              <div>
                <span class="font-weight-bold">Cambio:</span><br />
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

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const historial = ref([]);
const route = useRoute();
const router = useRouter();

const headers = [
  { text: 'ID Habitación', value: 'id_Habitacion', width: '100px' },
  { text: 'Número', value: 'numero_Habitacion', width: '100px' },
  { text: 'Cambio de Estado', value: 'estado_Cambio', width: '150px' },
  { text: 'Entrada', value: 'fecha_Entrada', width: '150px' },
  { text: 'Salida', value: 'fecha_Salida', width: '150px' },
  { text: 'Fecha Cambio', value: 'fecha_Cambio', width: '150px' },
  { text: 'Usuario', value: 'usuario_Modificacion' }
];

const goBack = () => {
  router.push({
    path: '/habitaciones',
    query: {
      username: route.query.username,
      role: route.query.role,
    },
  });
};

const formatDate = (fecha) => {
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
};

const getEstadoColor = (estado) => {
  const colors = {
    'Ocupada': 'red',
    'Disponible': 'green',
    'Reservada': 'orange',
    'Limpieza': 'blue',
    'Mantenimiento': 'purple'
  };
  return colors[estado] || 'grey';
};

const cargarHistorial = async () => {
  try {
    const res = await axios.get("https://www.hotelcost.somee.com/api/Habitaciones/HistorialCambios");
    historial.value = res.data
      .filter(item => 
        item.estado_Nuevo === 'Ocupada' || 
        item.estado_Anterior === 'Ocupada' ||
        item.estado_Nuevo === 'Limpieza' ||
        item.estado_Anterior === 'Limpieza' ||
        item.estado_Nuevo === 'Mantenimiento' ||
        item.estado_Anterior === 'Mantenimiento' ||
        item.estado_Nuevo === 'Reservada' ||
        item.estado_Anterior === 'Reservada'
      )
      .map(item => ({
        ...item,
        id_Habitacion: item.id_Habitacion || 'N/A',
        numero_Habitacion: item.numero_Habitacion || 'N/A',
        usuario_Modificacion: item.usuario_Modificacion || 'Usuario no especificado',
        estado_Cambio: `${item.estado_Anterior} → ${item.estado_Nuevo}`
      }))
      .sort((a, b) => new Date(b.fecha_Cambio) - new Date(a.fecha_Cambio));
  } catch (err) {
    console.error('Error al cargar historial:', err);
    // Opcional: mostrar notificación de error al usuario
  }
};

onMounted(cargarHistorial);
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