<template>
  <v-app>
    <!-- ================================
         CABECERA: logo | título centrado | botón REGRESAR
         ========================================= -->
    <v-app-bar app color="#1a1a1a" dark height="100">
      <v-row no-gutters align="center" class="w-100">
        <!-- 1) Logo a la izquierda -->
        <v-col cols="2" class="d-flex align-center">
          <v-img
            src="@/assets/logotiopo.png"
            alt="Logo"
            contain
            max-width="55"
          />
        </v-col>

        <!-- 2) Título EN EL CENTRO -->
        <v-col cols="8" class="text-center">
          <span class="white--text text-h5 font-weight-bold">
            Registro de Clientes
          </span>
        </v-col>

        <!-- 3) Botón “REGRESAR” a la derecha -->
        <v-col cols="2" class="d-flex justify-end">
          <v-btn class="regresar-btn" @click="goToHome">
            REGRESAR
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <!-- ================================
         CONTENIDO PRINCIPAL: formulario de clientes
         ========================================= -->
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
import axios from "axios";

export default {
  name: "RegistroCliente",
  data() {
    return {
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "green",
      // Para leer username/role si hiciera falta:
      usuario: "",
      role: "",
    };
  },
  methods: {
    goToHome() {
      this.$router.push({ path: "/home", query: this.$route.query });
    },
    async registrarCliente() {
      // Validar el formulario
      if (!this.$refs.form.validate()) return;

      const nuevo = {
        nombre: this.nombre,
        apellido: this.apellido,
        numero: this.telefono,
        correo: this.correo,
      };

      try {
        const { data } = await axios.post(
          "https://hotelcost.somee.com/api/Clientes",
          nuevo
        );
        this.snackbarMessage = data.message || "Cliente registrado con éxito";
        this.snackbarColor = "green";
      } catch {
        this.snackbarMessage = "Error al registrar cliente";
        this.snackbarColor = "red";
      } finally {
        this.snackbar = true;
        this.nombre = this.apellido = this.telefono = this.correo = "";
        this.$refs.form.reset();
      }
    },
  },
  mounted() {
    const { username, role } = this.$route.query;
    this.usuario = username || "Invitado";
    this.role = role || "Sin rol asignado";
  },
};
</script>

<style scoped>
/* ==================================================
   1) El contenido no se “pise” con el AppBar
   ================================================== */
.registro-container {
  background-color: #22cbc3;
  min-height: calc(100vh - 100px);
  /* Damos un padding-top mayor para que el card baje un poco más */
  padding-top: 120px;
}

/* ==================================================
   2) Estilos para la tarjeta de registro
   ================================================== */
.registro-card {
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 12px;
  max-width: 850px;
  width: 90%;
  padding: 30px 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
}

/* ==================================================
   3) Título “Nuevo Cliente”
   ================================================== */
.registro-header {
  color: white;
  font-size: 1.2rem;
  padding-bottom: 6px;
}

/* ==================================================
   4) Espaciado en las filas del formulario
   ================================================== */
.form-row {
  row-gap: 16px;
  column-gap: 12px;
}

/* ==================================================
   5) Text-fields con fondo oscuro tenue
   ================================================== */
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
/* Cuando hay error, borde y mensaje en amarillo */
.v-text-field--error >>> .v-input__control {
  border-color: #fdd835 !important;
}
.v-text-field--error >>> .v-messages__message {
  color: #fdd835 !important;
}

/* ==================================================
   6) Botón “REGISTRAR CLIENTE”
   ================================================== */
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

/* ==================================================
   7) Botón “REGRESAR” en el AppBar, ajustado
   ================================================== */
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
</style>
