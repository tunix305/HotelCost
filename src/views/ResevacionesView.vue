<template>
  <v-app>
    <!-- Navbar alineada -->
    <v-app-bar app color="#1a1a1a" dark height="auto" class="navbar">
  <v-container fluid class="d-flex align-center justify-space-between flex-wrap px-6">
    <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="50" class="logo-img" />
    <h1 class="navbar-title white--text text-center">Registro de Reservas</h1>
    <v-btn class="regresar-btn" @click="goToHome">REGRESAR</v-btn>
  </v-container>
</v-app-bar>


    <!-- Main con fondo turquesa y cards más abajo -->
    <v-main class="reservas-main pa-0">
      <v-container fluid class="pa-0">
        <v-row no-gutters justify="center" align="start" class="cards-wrapper">
          <!-- Tarjeta de formulario -->
          <v-col cols="12" md="5" class="px-4">
            <v-card class="gest-card">
              <div class="card-header form-header">
                <v-icon left>mdi-calendar-plus</v-icon>
                <span>Reservación</span>
              </div>
              <v-card-text>
                <v-form @submit.prevent="abrirConfirmacion">
                  <v-select
                    v-model="cliente"
                    :items="clientes"
                    item-title="nombreCompleto"
                    item-value="id"
                    label="Cliente"
                    outlined
                    dense
                    required
                    class="input-field"
                  />
                  <v-text-field
                    v-model="fechaInicio"
                    label="Fecha de Inicio"
                    type="date"
                    :min="today"
                    outlined
                    dense
                    required
                    class="input-field"
                  />
                  <v-text-field
                    v-model="fechaFin"
                    label="Fecha de Fin"
                    type="date"
                    :min="fechaInicio || today"
                    outlined
                    dense
                    required
                    class="input-field"
                  />
                  <v-select
                    v-model="estado"
                    :items="estados"
                    label="Estado"
                    outlined
                    dense
                    required
                    class="input-field"
                  />
                  <v-select
                    v-model="habitacion"
                    :items="habitaciones"
                    item-title="habitacionDisplay"
                    item-value="id_Habitacion"
                    label="Habitación Disponible"
                    outlined
                    dense
                    required
                    class="input-field"
                    @update:modelValue="actualizarTipo"
                  />
                  <v-btn block type="submit" class="register-button mt-6" large>Reservar</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Tarjeta de habitaciones ocupadas -->
          <v-col cols="12" md="6" class="px-4">
            <v-card class="gest-card">
              <div class="card-header occupied-header">
                <v-icon left>mdi-bed-outline</v-icon>
                <span>Habitaciones Ocupadas ({{ habitacionesOcupadas.length }})</span>
              </div>
              <v-card-text class="pa-0">
                <v-data-table
                  :headers="headersOcupadas"
                  :items="habitacionesOcupadas"
                  class="elevation-1"
                  hide-default-header
                  hide-default-footer
                  dense
                >
                  <template #item.costo="{ item }">
                    ${{ item.costo.toLocaleString('es-MX') }}
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Diálogo de confirmación -->
        <v-dialog v-model="confirmacionDialog" max-width="500">
          <v-card>
            <v-card-title class="text-h5 font-weight-bold">Confirmar Reserva</v-card-title>
            <v-card-text>
              <p><strong>Cliente:</strong> {{ nombreClienteSeleccionado }}</p>
              <p>
                <strong>Habitación:</strong>
                {{ habitacionSeleccionada?.numero_Habitacion }} - {{ tipoSeleccionado }}
              </p>
              <p><strong>Estado:</strong> {{ estado }}</p>
              <p><strong>Desde:</strong> {{ fechaInicio }}</p>
              <p><strong>Hasta:</strong> {{ fechaFin }}</p>
              <p class="mt-4">
                Total a pagar: <strong>${{ costoTotal }}</strong>
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="confirmarReserva">Pagar y Reservar</v-btn>
              <v-btn text @click="confirmacionDialog = false">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar de feedback -->
        <v-snackbar v-model="snackbar" timeout="3000" color="green">
          {{ snackbarMessage }}
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegistroReservas',
  data() {
    return {
      username: '',
      role: '',
      cliente: null,
      clientes: [],
      fechaInicio: '',
      fechaFin: '',
      estado: '',
      habitacion: null,
      habitaciones: [],
      habitacionesOcupadas: [],
      headersOcupadas: [
        { text: 'Habitación', value: 'numero_Habitacion' },
        { text: 'Estado', value: 'estado_Actual' },
        { text: 'Tipo', value: 'tipo_Habitacion' },
        { text: 'Precio', value: 'costo' },
        { text: 'Cliente', value: 'nombreCliente' },
      ],
      estados: ['Pendiente', 'Confirmada', 'Cancelada'],
      confirmacionDialog: false,
      tipoHabitacion: '',
      costoTotal: 0,
      snackbar: false,
      snackbarMessage: '',
      today: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0],
      tipoSeleccionado: '',
      habitacionSeleccionada: null,
      nombreClienteSeleccionado: '',
    };
  },
  methods: {
    goToHome() {
      this.$router.push({
        path: '/home',
        query: { username: this.username, role: this.role },
      });
    },
    async cargarHabitacionesDisponibles() {
      try {
        const res = await axios.get(
          'https://hotelcost.somee.com/api/Habitaciones/EstadosActualizados'
        );
        this.habitaciones = res.data
          .filter((h) => h.estado_Actual.toLowerCase() === 'disponible')
          .map((h) => ({
            ...h,
            habitacionDisplay: `#${h.numero_Habitacion} - ${h.tipo_Habitacion}`,
          }));
      } catch (error) {
        console.error('Error al obtener disponibles:', error);
      }
    },
    actualizarTipo(id) {
      const hab = this.habitaciones.find((h) => h.id_Habitacion === id);
      if (hab) {
        this.habitacionSeleccionada = hab;
        this.tipoSeleccionado = hab.tipo_Habitacion;
        const precios = { Sencilla: 3500, Doble: 8000, Suite: 18000 };
        this.costoTotal = precios[hab.tipo_Habitacion] || 0;
      }
    },
    async cargarHabitacionesOcupadas() {
      try {
        const res = await axios.get(
          'https://hotelcost.somee.com/api/Reservacion/OcupadasConCliente'
        );
        this.habitacionesOcupadas = res.data;
      } catch (error) {
        console.error('Error al obtener ocupadas:', error);
      }
    },
    async cargarClientes() {
      try {
        const res = await axios.get('https://hotelcost.somee.com/api/Clientes');
        const ocupadas = this.habitacionesOcupadas.map((r) =>
          r.nombreCliente?.toLowerCase()
        );
        this.clientes = res.data
          .map((c) => ({ id: c.id, nombreCompleto: `${c.nombre} ${c.apellido}` }))
          .filter(
            (c) => !ocupadas.includes(c.nombreCompleto.toLowerCase())
          );
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    },
    abrirConfirmacion() {
      if (
        !this.cliente ||
        !this.fechaInicio ||
        !this.fechaFin ||
        !this.estado ||
        !this.habitacion
      ) {
        this.snackbarMessage = 'Por favor, completa todos los campos.';
        this.snackbar = true;
        return;
      }
      const clienteObj = this.clientes.find((c) => c.id === this.cliente);
      this.nombreClienteSeleccionado = clienteObj
        ? clienteObj.nombreCompleto
        : '';
      this.confirmacionDialog = true;
    },
    confirmarReserva() {
      if (!this.habitacionSeleccionada) {
        this.snackbarMessage = 'Habitación no válida.';
        this.snackbar = true;
        return;
      }

      const nuevaReserva = {
        Numero_Habitacion: this.habitacionSeleccionada.numero_Habitacion,
        Numero_Cliente: this.cliente,
        FechaInicio: this.fechaInicio,
        FechaFinal: this.fechaFin,
        EstadoReserva: this.estado,
        Costo: this.costoTotal,
      };

      axios
        .post(
          'https://hotelcost.somee.com/api/Reservacion',
          nuevaReserva
        )
        .then(() => {
          return axios.put(
            'https://hotelcost.somee.com/api/Habitaciones/ActualizarEstado',
            {
              Numero_Habitacion: this.habitacionSeleccionada.numero_Habitacion,
              Estado_Actual: 'Ocupada',
            }
          );
        })
        .then(() => {
          this.snackbarMessage = 'Reserva registrada con éxito.';
          this.snackbar = true;
          this.confirmacionDialog = false;
          this.resetFormulario();
          this.cargarHabitacionesOcupadas();
        })
        .catch((error) => {
          console.error('❌ Error al registrar reserva:', error);
          this.snackbarMessage = 'Error al registrar la reserva.';
          this.snackbar = true;
        });
    },
    resetFormulario() {
      this.cliente = null;
      this.fechaInicio = '';
      this.fechaFin = '';
      this.estado = '';
      this.habitacion = null;
      this.tipoHabitacion = '';
      this.costoTotal = 0;
      this.cargarHabitacionesDisponibles();
      this.habitacionSeleccionada = null;
      this.tipoSeleccionado = '';
      this.nombreClienteSeleccionado = '';
    },
  },
  mounted() {
    const q = this.$route.query;
    this.username = q.username || 'Invitado';
    this.role = q.role || 'Sin rol asignado';
    this.cargarHabitacionesDisponibles();
    this.cargarHabitacionesOcupadas();
    this.cargarClientes();
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>

<style scoped>
.reservas-main {
  background-color: #22cbc3 !important;
  /* El padding-top se ajusta exactamente a la altura del AppBar (80px),
     así el contenido comienza justo debajo y no “choca” con el REGRESAR */
  min-height: calc(100vh - 80px);
  padding-top: 80px;
}

.cards-wrapper {
  max-width: 1200px;
  margin: 0 auto; /* Sin márgenes extra hacia abajo */
}

.px-4 {
  padding-left: 16px !important;
  padding-right: 16px !important;
}

.gest-card {
  background-color: #031a1a;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: white;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-weight: bold;
  font-size: 1.1rem;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.form-header {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
.occupied-header {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.input-field .v-input__control {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border-radius: 8px;
}

.register-button,
.back-button {
  background-color: #ffc107 !important;
  color: #010626 !important;
  font-weight: bold;
}
.register-button:hover {
  background-color: #e0a800 !important;
}

/* El botón REGRESAR está “colocado” con padding en el Contenedor de la AppBar,
   así ya no se superpone con las tarjetas. */
.back-button {
  margin-right: 16px;
}
.navbar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  flex: 1;
}

.logo-img {
  max-width: 50px;
}

@media (max-width: 600px) {
  .navbar-title {
    font-size: 1rem;
    margin: 8px 0;
  }

  .regresar-btn {
    font-size: 0.75rem !important;
    padding: 6px 16px !important;
    min-width: unset;
  }

  .logo-img {
    max-width: 40px;
  }
}

</style>
