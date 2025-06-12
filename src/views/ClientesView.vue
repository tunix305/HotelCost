<template>
  <v-app>
    <v-app-bar app color="#1a1a1a" dark height="auto" class="navbar">
      <v-container fluid class="d-flex align-center justify-space-between flex-wrap px-6">
        <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="50" class="logo-img" />
        <h1 class="navbar-title white--text text-center">Registro de Clientes</h1>
        <v-btn class="regresar-btn" @click="goToHome">REGRESAR</v-btn>
      </v-container>
    </v-app-bar>

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
                <!-- Nombre -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="nombre"
                    label="Nombre"
                    prepend-inner-icon="mdi-account"
                    outlined dense clearable required
                    @keypress="soloLetras($event)"
                  />
                </v-col>

                <!-- Apellido -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="apellido"
                    label="Apellido"
                    prepend-inner-icon="mdi-account-outline"
                    outlined dense clearable required
                    @keypress="soloLetras($event)"
                  />
                </v-col>

                <!-- Teléfono -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="telefono"
                    label="Teléfono"
                    prepend-inner-icon="mdi-phone"
                    outlined dense clearable type="tel"
                    maxlength="10"
                    :rules="[telefonoRule]"
                    @keypress="soloNumeros($event)"
                    @blur="validarTelefono"
                  />
                </v-col>

                <!-- Correo -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="correo"
                    label="Correo Electrónico"
                    prepend-inner-icon="mdi-email"
                    outlined dense clearable type="email"
                    :rules="[correoRule]"
                    @blur="validarCorreo"
                  />
                </v-col>

                <v-col cols="12" class="text-center mt-4">
                  <v-btn type="submit" class="submit-btn" large>REGISTRAR CLIENTE</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'RegistroCliente',
  data() {
    return {
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      telefonoRule: () => true,
      correoRule: () => true,
    };
  },
  methods: {
    goToHome() {
      this.$router.push({ path: '/home', query: this.$route.query });
    },
    soloLetras(e) {
      const char = String.fromCharCode(e.keyCode || e.which);
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/.test(char)) {
        e.preventDefault();
      }
    },
    soloNumeros(e) {
      if (!/\d/.test(e.key)) {
        e.preventDefault();
      }
    },
    validarTelefono() {
      this.telefonoRule = () =>
        /^\d{10}$/.test(this.telefono) || 'Debe tener exactamente 10 dígitos';
    },
    validarCorreo() {
      this.correoRule = () =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.correo) || 'Correo inválido';
    },
    async registrarCliente() {
      this.validarTelefono();
      this.validarCorreo();

      if (!this.$refs.form.validate()) {
        Swal.fire('Campos incompletos', 'Revisa los campos del formulario.', 'warning');
        return;
      }

      const nuevo = {
        nombre: this.nombre,
        apellido: this.apellido,
        numero: this.telefono,
        correo: this.correo,
      };

      try {
        const { data } = await axios.post('https://hotelcost.somee.com/api/Clientes', nuevo);
        Swal.fire('Registrado', data.message || 'Cliente registrado con éxito', 'success');
        this.nombre = this.apellido = this.telefono = this.correo = '';
        this.$refs.form.reset();
      } catch {
        Swal.fire('Error', 'No se pudo registrar el cliente', 'error');
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
    min-height: calc(100vh - 100px);
    padding-top: 120px; /* Aumentamos el espacio superior para bajar el card */
  }

  .registro-card {
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 12px;
    max-width: 850px;
    width: 90%;
    padding: 30px 20px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }

  .registro-header {
    color: white;
    font-size: 1.2rem;
    padding-bottom: 6px;
  }

  .form-row {
    row-gap: 16px;
    column-gap: 12px;
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
    padding: 10px 32px !important;
    transition: transform 0.2s, box-shadow 0.2s;
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
    padding: 10px 25px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .regresar-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
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
