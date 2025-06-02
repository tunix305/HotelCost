<template>
  <v-app>
    <!-- ================================
         Cabecera reestructurada
         ========================================= -->
    <v-app-bar app color="#1a1a1a" dark height="100">
      <v-row no-gutters align="center" class="w-100">
        <!-- 1) Logo a la izquierda -->
        <v-col cols="2" class="d-flex align-center">
          <v-img
            src="@/assets/logotiopo.png"
            alt="Logo"
            contain
            max-width="60"
          />
        </v-col>

        <!-- 2) Título centrado -->
        <v-col cols="8" class="text-center">
          <span class="white--text font-weight-bold text-h6">
            Gestión de Tareas
          </span>
        </v-col>

        <!-- 3) Botón “REGRESAR” a la derecha -->
        <v-col cols="2" class="d-flex justify-end">
          <v-btn class="custom-back-btn" @click="goToHome">
            REGRESAR
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <!-- Resto de tu pantalla: formulario de tareas, v-main, etc. -->
    <v-main class="tareas-fondo pa-0">
      <v-container fluid class="d-flex justify-center align-start">
        <v-card class="tarea-card" elevation="12">
          <!-- ... aquí va tu formulario de Tareas ... -->
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "TareasView",
  data() {
    return {
      rooms: [],
      asignables: [],
      statuses: ["En Mantenimiento", "Limpieza"],
      priorities: ["Alta", "Media", "Baja"],
      selectedRoom: null,
      selectedStatus: null,
      selectedPriority: null,
      selectedUser: null,
      taskDescription: "",
      username: "",
      role: "",
    };
  },
  methods: {
    goToHome() {
      this.$router.push({
        path: "/home",
        query: {
          username: this.username,
          role: this.role,
        },
      });
    },
    async obtenerHabitaciones() {
      try {
        const response = await axios.get(
          "https://hotelcost.somee.com/api/Habitaciones/ListaSeleccion"
        );
        this.rooms = response.data;
      } catch (error) {
        console.error("❌ Error al obtener habitaciones:", error);
        alert("No se pudieron cargar las habitaciones");
      }
    },
    async obtenerUsuariosAsignables() {
      try {
        const response = await axios.get(
          "https://hotelcost.somee.com/api/Users/Asignables"
        );
        this.asignables = response.data.map((u) => ({
          id: u.id,
          nombre: `${u.nombre} (${u.rol})`,
          username: u.username,
        }));
      } catch (error) {
        console.error("❌ Error al obtener usuarios asignables:", error);
        alert("No se pudieron cargar los usuarios asignables");
      }
    },
    async actualizarEstado() {
      if (
        !this.selectedRoom ||
        !this.selectedStatus ||
        !this.selectedPriority ||
        !this.selectedUser ||
        !this.taskDescription
      ) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      const usuarioSeleccionado = this.asignables.find(
        (a) => a.id === this.selectedUser
      );

      const nuevaTarea = {
        numero_Tarea: 0,
        descripcion: this.taskDescription,
        numero_Habitacion: parseInt(this.selectedRoom),
        estado_Habitacion: this.selectedStatus,
        nivel_Prioridad: this.selectedPriority,
        numero_Asignacion: parseInt(this.selectedUser),
        usuario_Asignado: usuarioSeleccionado?.username || "desconocido",
      };

      try {
        const response = await axios.post(
          "https://hotelcost.somee.com/api/Tareas",
          nuevaTarea
        );
        alert(response.data.message || "✅ Tarea guardada correctamente");
        this.selectedRoom = null;
        this.selectedStatus = null;
        this.selectedPriority = null;
        this.selectedUser = null;
        this.taskDescription = "";
      } catch (error) {
        console.error("❌ Error al guardar la tarea:", error);
        alert("❌ Ocurrió un error al guardar la tarea");
      }
    },
  },
  mounted() {
    const query = this.$route.query;
    this.username = query.username || "Invitado";
    this.role = query.role || "Sin rol asignado";

    this.obtenerHabitaciones();
    this.obtenerUsuariosAsignables();
  },
};
</script>

<style scoped>
/* -----------------------------
   1) Evita que el contenido se “pise” con el AppBar
   ----------------------------- */
.tareas-fondo {
  background-color: #22cbc3;
  /* El padding-top debe ser exactamente la altura del AppBar (100px) */
  padding-top: 100px !important;
  min-height: calc(100vh - 100px);
}

/* -----------------------------
   2) Estilos para la tarjeta que contiene el formulario
   ----------------------------- */
.tarea-card {
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 40px;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 600px;
}

/* -----------------------------
   3) Campos con fondo oscuro tenue
   ----------------------------- */
.custom-field {
  margin-bottom: 20px;
  color: white;
}

/* -----------------------------
   4) Botón “ACTUALIZAR”
   ----------------------------- */
.custom-reservar-btn {
  background-color: #fbc02d !important;
  color: black !important;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px;
  box-shadow: none;
  letter-spacing: 0.5px;
  height: 45px;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}
.custom-reservar-btn:hover {
  background-color: #fdd835 !important;
}

/* -----------------------------
   5) Botón “REGRESAR” más compacto
   ----------------------------- */
.custom-back-btn {
  background-color: #fbc02d !important;
  color: black !important;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px;
  box-shadow: none;

  /* Reducir padding/altura y fuente */
  padding: 4px 12px !important;
  height: 36px !important;
  font-size: 0.75rem !important;

  transition: background-color 0.3s ease;
}
.custom-back-btn:hover {
  background-color: #fdd835 !important;
}

/* -----------------------------
   6) Asegurarse de que las columnas del AppBar se distribuyan correctamente
   ----------------------------- */
.navbar-container {
  position: relative;
  width: 100%;
}
.navbar-title {
  /* ya no necesitamos position:absolute; al usar v-col centramos */
}

/* -----------------------------
   7) Si quieres ajustes adicionales en móvil (opcional)
   ----------------------------- */
@media (max-width: 600px) {
  .custom-back-btn {
    padding: 2px 10px !important;
    height: 32px !important;
    font-size: 0.7rem !important;
  }
}
</style>
