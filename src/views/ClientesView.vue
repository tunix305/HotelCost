<template>
  <v-app>
    <!-- Navbar optimizada para mobile -->
    <v-app-bar app color="#1a1a1a" dark :height="mobile ? 80 : 100">
      <v-container fluid class="d-flex align-center justify-space-between px-3 px-sm-6">
        <v-img 
          src="@/assets/logotiopo.png" 
          alt="Logo" 
          :max-width="mobile ? 45 : 55" 
          contain
          class="mr-1"
        />
        <h1 class="white--text text-subtitle-1 text-sm-h5 font-weight-bold flex-grow-1 text-center mb-0 px-1">
          Registro de Clientes
        </h1>
        <v-btn 
          class="regresar-btn" 
          @click="goToHome"
          :height="mobile ? 36 : 40"
          :width="mobile ? 'auto' : 'auto'"
        >
          <span class="d-none d-sm-inline">REGRESAR</span>
          <v-icon v-if="mobile" small>mdi-arrow-left</v-icon>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Main Content optimizado para mobile -->
    <v-main class="registro-container">
      <v-container fluid class="d-flex justify-center pa-2 pa-sm-4">
        <v-card class="registro-card" elevation="12">
          <v-card-title class="registro-header text-subtitle-1 text-sm-h6 font-weight-medium text-center justify-center">
            Nuevo Cliente
          </v-card-title>
          
          <v-divider />
          <v-card-text class="px-2 px-sm-4">
            <v-form @submit.prevent="registrarCliente" ref="form">
              <v-row class="form-row" dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="nombre"
                    label="Nombre"
                    prepend-inner-icon="mdi-account"
                    outlined
                    dense
                    clearable
                    required
                    :class="{'mobile-field': mobile}"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="apellido"
                    label="Apellido"
                    prepend-inner-icon="mdi-account-outline"
                    outlined
                    dense
                    clearable
                    required
                    :class="{'mobile-field': mobile}"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="telefono"
                    label="Teléfono"
                    prepend-inner-icon="mdi-phone"
                    outlined
                    dense
                    clearable
                    :rules="[v => /^\\d{10}$/.test(v) || 'Debe tener 10 dígitos']"
                    required
                    :class="{'mobile-field': mobile}"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="correo"
                    label="Correo Electrónico"
                    prepend-inner-icon="mdi-email"
                    outlined
                    dense
                    clearable
                    type="email"
                    :rules="[v => /.+@.+\\..+/.test(v) || 'Email inválido']"
                    required
                    :class="{'mobile-field': mobile}"
                  />
                </v-col>
                <v-col cols="12" class="text-center mt-2 mt-sm-4">
                  <v-btn 
                    type="submit" 
                    class="submit-btn" 
                    :large="!mobile"
                    :block="mobile"
                  >
                    REGISTRAR CLIENTE
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
            {{ snackbarMessage }}
          </v-snackbar>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import { useDisplay } from 'vuetify';

export default {
  name: 'RegistroCliente',
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
  },
  data() {
    return {
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'green',
    };
  },
  methods: {
    goToHome() {
      this.$router.push({ path: '/home', query: this.$route.query });
    },
    async registrarCliente() {
      if (!this.$refs.form.validate()) return;
      const nuevo = {
        nombre: this.nombre,
        apellido: this.apellido,
        numero: this.telefono,
        correo: this.correo,
      };
      try {
        const { data } = await axios.post('https://hotelcost.somee.com/api/Clientes', nuevo);
        this.snackbarMessage = data.message || 'Cliente registrado con éxito';
        this.snackbarColor = 'green';
      } catch {
        this.snackbarMessage = 'Error al registrar cliente';
        this.snackbarColor = 'red';
      } finally {
        this.snackbar = true;
        this.nombre = this.apellido = this.telefono = this.correo = '';
        this.$refs.form.reset();
      }
    },
  },
  mounted() {
    const { username, role } = this.$route.query;
    this.usuario = username || 'Invitado';
    this.role = role || 'Sin rol asignado';
  },
};
</script>

<style scoped>
.registro-container {
  background-color: #22cbc3;
  min-height: calc(100vh - 80px);
  padding-top: 20px;
}

@media (min-width: 600px) {
  .registro-container {
    padding-top: 40px;
    min-height: calc(100vh - 100px);
  }
}

.registro-card {
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 12px;
  max-width: 850px;
  width: 100%;
  padding: 20px 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

@media (min-width: 600px) {
  .registro-card {
    padding: 30px 20px;
  }
}

.registro-header {
  color: white;
  padding-bottom: 6px;
}

.mobile-field {
  font-size: 0.9rem;
}

/* Custom text-field styling */
.v-text-field >>> .v-input__control {
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
}
.v-text-field >>> .v-label {
  color: rgba(255, 255, 255, 0.7);
}
.v-text-field >>> input {
  color: white;
}
.v-text-field--error >>> .v-input__control {
  border-color: #fdd835 !important;
}
.v-text-field--error >>> .v-messages__message {
  color: #fdd835 !important;
}

.submit-btn {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
  font-weight: bold !important;
  border-radius: 6px !important;
  padding: 8px 16px !important;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 200px;
}

@media (min-width: 600px) {
  .submit-btn {
    padding: 10px 32px !important;
  }
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3) !important;
}

.regresar-btn {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
  font-weight: bold;
  border-radius: 999px;
  padding: 0 12px;
  min-width: auto;
  transition: transform 0.2s, box-shadow 0.2s;
}

@media (min-width: 600px) {
  .regresar-btn {
    padding: 0 25px;
  }
}

.regresar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}
</style>