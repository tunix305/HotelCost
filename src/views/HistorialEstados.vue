<template>
  <div>
    <div class="header">
      Historial de Habitaciones en Mantenimiento
    </div>

    <div class="container">
      <router-link to="/" class="btn-regresar">REGRESAR</router-link>
      <h2>Historial de Habitaciones en Mantenimiento</h2>

      <table v-if="!loading && historial.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Habitación</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in historial" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.habitacionNumero }}</td>
            <td>{{ formatDate(item.fechaInicio) }}</td>
            <td>{{ item.fechaFin ? formatDate(item.fechaFin) : 'N/A' }}</td>
            <td>{{ item.motivo }}</td>
            <td :class="['estado', getEstadoClass(item.estado)]">{{ item.estado }}</td>
            <td>{{ item.responsable }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="loading-message">
        Cargando datos...
      </div>

      <div v-if="!loading && historial.length === 0" class="no-data-message">
        No hay registros de mantenimiento disponibles.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const historial = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchHistorial = async () => {
      try {
        const { data } = await axios.get('https://hotelcost.somee.com/api/Habitaciones/HistorialEstados');
        historial.value = data;
      } catch (err) {
        error.value = 'Error al cargar el historial de mantenimiento';
        console.error('Error fetching maintenance history:', err);
      } finally {
        loading.value = false;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(dateString).toLocaleString('es-ES', options);
    };

    const getEstadoClass = (estado) => {
      if (estado.toLowerCase().includes('finalizado')) {
        return 'finalizado';
      } else if (estado.toLowerCase().includes('mantenimiento')) {
        return 'en-mantenimiento';
      }
      return '';
    };

    onMounted(() => {
      fetchHistorial();
    });

    return {
      historial,
      loading,
      error,
      formatDate,
      getEstadoClass
    };
  }
};
</script>

<style scoped>
body {
  background-color: #e0f7fa;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.header {
  background-color: #1a1a1a;
  color: white;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}

.container {
  margin: 40px auto;
  width: 90%;
  max-width: 1000px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

h2 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.btn-regresar {
  background-color: #fdd835;
  color: #1a1a1a;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 999px;
  text-decoration: none;
  float: right;
  margin-bottom: 20px;
}

.estado {
  font-weight: bold;
}

.estado.en-mantenimiento {
  color: #f57c00;
}

.estado.finalizado {
  color: #388e3c;
}

.loading-message,
.no-data-message {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}
</style>