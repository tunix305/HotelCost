<template>
  <v-app>
    <!-- Navbar -->
    <v-app-bar app color="#1a1a1a" dark height="100">
      <v-container fluid class="d-flex align-center justify-space-between px-6">
        <!-- Logo a la izquierda -->
        <v-img
          src="@/assets/logotiopo.png"
          alt="Logo"
          max-width="55"
          contain
        />

        <!-- Título centrado -->
        <h1 class="white--text text-h5 font-weight-bold flex-grow-1 text-center mb-0">
          Registro de Clientes
        </h1>

        <!-- Botón REGRESAR a la derecha -->
        <v-btn class="regresar-btn" @click="goToHome">
          REGRESAR
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Contenido Principal -->
    <v-main class="registro-container">
      <v-container fluid class="d-flex justify-center">
        <v-card class="registro-card" elevation="12">
          <v-card-title class="registro-header text-h6 font-weight-medium text-center justify-center">
            Nuevo Cliente
          </v-card-title>
          <v-divider />

          <v-card-text>
            <v-form @submit.prevent="registrarCliente" ref="form">
              <v-row class="form-row d-flex flex-column align-center" dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="nombre"
                    label="Nombre"
                    prepend-inner-icon="mdi-account"
                    outlined
                    dense
                    clearable
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="apellido"
                    label="Apellido"
                    prepend-inner-icon="mdi-account-outline"
                    outlined
                    dense
                    clearable
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="telefono"
                    label="Teléfono"
                    prepend-inner-icon="mdi-phone"
                    outlined
                    dense
                    clearable
                    :rules="[v => /^\d{10}$/.test(v) || 'Debe tener 10 dígitos']"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="correo"
                    label="Correo Electrónico"
                    prepend-inner-icon="mdi-email"
                    outlined
                    dense
                    clearable
                    type="email"
                    :rules="[v => /.+@.+\..+/.test(v) || 'Email inválido']"
                    required
                  />
                </v-col>
                <v-col cols="12" class="text-center mt-4">
                  <v-btn type="submit" class="submit-btn" large>
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

export default {
  name: 'RegistroCliente',
  data() {
    return {
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      snackbar: false,
      snackbarMessage: '',
      snackbarColor: 'green',
      usuario: '',
      role: ''
    };
  },
  methods: {
    goToHome() {
      // Redirige a /home conservando los query params
      this.$router.push({
        path: '/home',
        query: { username: this.usuario, role: this.role }
      });
    },
    async registrarCliente() {
      // Valida el formulario antes de enviar
      if (!this.$refs.form.validate()) return;

      const nuevo = {
        nombre: this.nombre,
        apellido: this.apellido,
        numero: this.telefono,
        correo: this.correo
      };

      try {
        const { data } = await axios.post('https://hotelcost.somee.com/api/Clientes', nuevo);
        this.snackbarMessage = data.message || 'Cliente registrado con éxito';
        this.snackbarColor = 'green';
      } catch (err) {
        console.error('❌ Error al registrar cliente:', err);
        this.snackbarMessage = 'Error al registrar cliente';
        this.snackbarColor = 'red';
      } finally {
        this.snackbar = true;
        // Limpiar campos y resetear validaciones
        this.nombre = '';
        this.apellido = '';
        this.telefono = '';
        this.correo = '';
        this.$refs.form.reset();
      }
    }
  },
  mounted() {
    // Obtiene los query params (username y role) para reenviarlos luego
    const { username, role } = this.$route.query;
    this.usuario = username || 'Invitado';
    this.role = role || 'Sin rol asignado';
  }
};
</script>

<style scoped>
/* Contenedor principal: deja espacio igual a la altura del AppBar */
.registro-container {
  background-color: #22cbc3;
  min-height: calc(100vh - 100px);
  padding-top: 120px; /* Baja el card para que no choque con la navbar */
}

/* Tarjeta del formulario */
.registro-card {
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 12px;
  max-width: 850px;
  width: 90%;
  padding: 30px 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

/* Encabezado de la tarjeta */
.registro-header {
  color: white;
  font-size: 1.2rem;
  padding-bottom: 6px;
}

/* Filas del formulario */
.form-row {
  row-gap: 16px;
  column-gap: 12px;
}

/* Estilos para los V-Text-Fields en modo oscuro */
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

/* Botón “REGISTRAR CLIENTE” */
.submit-btn {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
  font-weight: bold !important;
  border-radius: 6px !important;
  padding: 10px 32px !important;
  transition: transform 0.2s, box-shadow 0.2s;
}
.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3) !important;
}

/* Botón “REGRESAR” */
.regresar-btn {
  background-color: #fdd835 !important;
  color: #1a1a1a !important;
  font-weight: bold;
  border-radius: 999px;
  padding: 8px 16px;      /* Padding más ajustado */
  font-size: 0.85rem;     /* Texto un poco más chico */
  min-width: 100px;       /* Ancho mínimo para que no se encoja demasiado */
  transition: transform 0.2s, box-shadow 0.2s;
}
.regresar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

/* En pantallas muy angostas reducimos aún más el tamaño */
@media (max-width: 400px) {
  .regresar-btn {
    padding: 6px 12px;
    font-size: 0.75rem;
    min-width: 80px;
  }
}
</style>
