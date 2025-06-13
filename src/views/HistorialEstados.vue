<template>
  <v-app>
    <div class="header">
      Historial de Habitaciones en Mantenimiento
    </div>

    <div class="container">
      <v-btn class="btn-regresar" @click="regresar">REGRESAR</v-btn>
      <h2>Historial de Habitaciones en Mantenimiento</h2>

      <v-card>
        <v-table>
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
            <tr v-if="historial.length === 0">
              <td colspan="7">Cargando datos...</td>
            </tr>
            <tr v-for="item in historial" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.habitacion }}</td>
              <td>{{ item.fechaInicio }}</td>
              <td>{{ item.fechaFin }}</td>
              <td>{{ item.motivo }}</td>
              <td class="estado">{{ item.estado }}</td>
              <td>{{ item.responsable }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const historial = ref([])
const router = useRouter()

const cargarHistorial = async () => {
  try {
    const { data } = await axios.get('https://hotelcost.somee.com/api/Habitaciones/HistorialEstados')
    historial.value = data
  } catch (error) {
    console.error('Error al obtener historial:', error)
    historial.value = []
  }
}

const regresar = () => {
  router.push('/home') // o a donde debas regresar
}

onMounted(() => {
  cargarHistorial()
})
</script>

<style scoped>
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

.estado {
  font-weight: bold;
  color: #f57c00;
}

.btn-regresar {
  background-color: #fdd835;
  color: #1a1a1a;
  font-weight: bold;
  border-radius: 999px;
  margin-bottom: 20px;
}
</style>
