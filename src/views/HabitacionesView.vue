<template>
  <v-app>
    <!-- Barra de navegación -->
    <v-app-bar app color="#1a1a1a" dark height="100">
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="60" />

        <h1 class="white--text text-h5 font-weight-bold text-center flex-grow-1 mb-0">
          Gestión de Habitaciones
        </h1>

        <div class="d-flex align-center">
          <v-btn class="btn-historial mr-3" @click="verHistorial">
            HISTORIAL DE CAMBIOS
          </v-btn>
          <v-btn class="btn-regresar" @click="goToHome">REGRESAR</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Contenido principal con dos secciones separadas -->
    <v-main class="habitaciones-container">
      <v-container fluid>
        <v-row dense justify="center" align="start" class="section-row">
          <!-- Card Disponibles -->
          <v-col cols="12" md="5">
            <v-card class="section-card pa-6">
              <div class="section-header disponible">
                <v-icon left>mdi-checkbox-marked-circle</v-icon>
                Disponibles ({{ habitacionesDisponibles.length }})
              </div>
              <v-simple-table class="custom-table larger-table">
                <thead>
                  <tr>
                    <th class="header-cell header-title">NÚMERO DE HABITACIÓN</th>
                    <th class="header-cell header-title">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in habitacionesDisponibles" :key="room.id_Habitacion">
                    <td class="room-number">{{ room.numero_Habitacion }}</td>
                    <td class="estado-text">{{ room.estado_Actual }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>

          <!-- Card No Disponibles -->
          <v-col cols="12" md="5">
            <v-card class="section-card pa-6">
              <div class="section-header no-disponible">
                <v-icon left>mdi-close-circle</v-icon>
                No disponibles ({{ habitacionesNoDisponibles.length }})
              </div>
              <v-simple-table class="custom-table larger-table">
                <thead>
                  <tr>
                    <th class="header-cell header-title">NÚMERO DE HABITACIÓN</th>
                    <th class="header-cell header-title">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in habitacionesNoDisponibles" :key="room.id_Habitacion">
                    <td class="room-number">{{ room.numero_Habitacion }}</td>
                    <td class="estado-text">{{ room.estado_Actual }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HabitacionesView',
  data() {
    return {
      habitaciones: [],
      username: '',
      role: '',
    };
  },
  computed: {
    habitacionesDisponibles() {
      return this.habitaciones.filter(h => h.estado_Actual.toLowerCase() === 'disponible');
    },
    habitacionesNoDisponibles() {
      return this.habitaciones.filter(h => h.estado_Actual.toLowerCase() !== 'disponible');
    },
  },
  methods: {
    goToHome() {
      this.$router.push({
        path: '/home',
        query: {
          username: this.username,
          role: this.role,
        },
      });
    },
    verHistorial() {
      this.$router.push({
        path: '/historial-habitaciones',
        query: {
          username: this.username,
          role: this.role,
        },
      });
    },
    async cargarHabitaciones() {
      try {
        const res = await axios.get('https://hotelcost.somee.com/api/Habitaciones/EstadosActualizados');
        this.habitaciones = res.data;
      } catch (err) {
        console.error('❌ Error al cargar habitaciones:', err);
      }
    },
  },
  mounted() {
    const query = this.$route.query;
    this.username = query.username || 'Invitado';
    this.role = query.role || 'Sin rol asignado';
    this.cargarHabitaciones();
  },
};
</script>

<style scoped>
.habitaciones-container {
  background-color: #22cbc3;
  min-height: calc(100vh - 100px);
  padding: 100px 0 20px;
}

.section-row {
  gap: 24px;
}

.section-card {
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.5);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: white;
  font-weight: 600;
}

.section-header.disponible {
  background: rgba(34, 203, 195, 0.15);
}

.section-header.no-disponible {
  background: rgba(255, 189, 189, 0.15);
}

.section-header .v-icon {
  color: #fdd835;
  margin-right: 8px;
}

.custom-table {
  background: transparent !important;
  color: white;
  padding: 8px;
}

.header-cell {
  color: white;
  font-weight: bold;
  background: transparent !important;
  padding: 8px;
}

.header-title {
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.room-number {
  font-weight: bold;
  font-size: 1.8rem;
  color: #fff;
  padding: 8px;
}

.estado-text {
  font-size: 1rem;
  font-weight: 500;
  color: white;
  padding: 8px;
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

.btn-historial {
  background-color: #ffffff !important;
  color: #1a1a1a !important;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 999px;
  text-transform: uppercase;
  font-size: 0.9rem;
  box-shadow: none;
  transition: 0.3s ease;
}

.btn-historial:hover {
  background-color: #fdd835 !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
