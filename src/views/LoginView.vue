<template>
  <v-app>
    <v-container class="login-container d-flex justify-center align-center" fluid>
      <v-card class="habitaciones-style-card pa-8" elevation="10" max-width="500">
        <v-card-title class="text-h6 font-weight-bold text-center mb-4 text-white">
          Iniciar Sesión
        </v-card-title>

        <v-img src="@/assets/logotiopo.png" contain height="70" class="mx-auto mb-4"></v-img>

        <v-form @submit.prevent="login">
          <v-text-field
            v-model="username"
            label="Usuario"
            variant="outlined"
            density="comfortable"
            class="custom-field"
            required
          />
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            variant="outlined"
            density="comfortable"
            class="custom-field"
            required
          />

          <v-btn class="login-button mt-4" block type="submit" size="large">INICIAR SESIÓN</v-btn>
        </v-form>

        <div class="help-links mt-4 text-center">
          <span @click="showErrorDialog = true" class="help-text">¿Tienes algún error?</span>
          <br />
          <span @click="showPasswordDialog = true" class="help-text">
            ¿Olvidaste la contraseña?
          </span>
        </div>
      </v-card>

      <!-- Snackbar -->
      <v-snackbar v-model="snackbar" timeout="3000" color="error">
        {{ snackbarMessage }}
      </v-snackbar>

      <!-- Diálogos -->
      <v-dialog v-model="showErrorDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Soporte</v-card-title>
          <v-card-text>Comunícate con uno de nuestros asesores.</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="showErrorDialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showPasswordDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Recuperar Contraseña</v-card-title>
          <v-card-text>Contacta al administrador para recuperar tu acceso.</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="showPasswordDialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      snackbar: false,
      snackbarMessage: '',
      showErrorDialog: false,
      showPasswordDialog: false,
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.snackbarMessage = 'Por favor, completa usuario y contraseña.';
        this.snackbar = true;
        return;
      }

      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/Users/login`, {
          username: this.username,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('loggedInUser', this.username.toLowerCase());

        this.$router.push({
          path: '/home',
          query: { username: this.username }
        });
      } catch (error) {
        console.error('❌ Error en login:', error.response || error);
        this.snackbarMessage = error.response?.data?.message || 'Error en autenticación';
        this.snackbar = true;
      }
    },
  },
};
</script>


<style scoped>
  .login-container {
    height: 100vh;
    background-color: #22cbc3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .habitaciones-style-card {
    background-color: #005f73;
    color: white;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 500px;
    backdrop-filter: blur(4px);
  }

  .custom-field .v-input__control {
    background-color: #005f73 !important;
    color: white !important;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .custom-field input {
    color: white !important;
  }

  .custom-field .v-label {
    color: white !important;
  }

  .login-button {
    background-color: #fcd34d;
    color: #333;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 30px;
    letter-spacing: 1px;
  }

  .help-text {
    font-size: 0.9rem;
    color: #ffffff;
    text-decoration: underline;
    cursor: pointer;
  }

  .help-text:hover {
    color: #fcd34d;
  }
</style>
