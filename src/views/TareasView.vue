<template>
  <v-app>
    <v-app-bar app color="#1a1a1a" dark height="auto" class="navbar">
  <v-container fluid class="d-flex align-center justify-space-between flex-wrap px-6">
    <v-img src="@/assets/logotiopo.png" alt="Logo" max-width="50" class="logo-img" />
    <h1 class="navbar-title white--text text-center">Gestión de Tareas</h1>
    <v-btn class="custom-back-btn" @click="goToHome">REGRESAR</v-btn>
  </v-container>
</v-app-bar>


    <v-main class="tareas-fondo pa-0">
      <v-container fluid class="d-flex justify-center align-start">
        <v-card class="tarea-card" elevation="12">
          <v-form @submit.prevent="actualizarEstado">
            <h2 class="white--text text-center mb-6">
              Tareas Pendientes y Estado de Habitaciones
            </h2>

            <v-select
              v-model="selectedRoom"
              :items="rooms"
              item-title="nombre"
              item-value="numero"
              label="Número de Habitación"
              outlined
              dense
              class="custom-field"
              required
            />

            <v-select
              v-model="selectedStatus"
              :items="statuses"
              label="Estado de la Habitación"
              outlined
              dense
              class="custom-field"
              required
            />

            <v-select
              v-model="selectedPriority"
              :items="priorities"
              label="Prioridad de la Habitación"
              outlined
              dense
              class="custom-field"
              required
            />

            <v-select
              v-model="selectedUser"
              :items="asignables"
              item-title="nombre"
              item-value="id"
              label="Asignar tarea a"
              outlined
              dense
              class="custom-field"
              required
            />

            <v-textarea
              v-model="taskDescription"
              label="Descripción de la Tarea"
              outlined
              dense
              rows="3"
              class="custom-field"
              required
            />

            <!-- Botón ACTUALIZAR ESTADO -->
            <v-btn block class="custom-reservar-btn mt-6" type="submit">
              ACTUALIZAR ESTADO
            </v-btn>
          </v-form>
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
/* ==================================================
   1) Evita que el contenido se “pise” con el AppBar
   ================================================== */
.tareas-fondo {
  background-color: #22cbc3;
  /* padding-top = altura del app-bar (100px) */
  padding-top: 100px !important;
  min-height: calc(100vh - 100px);
}

/* ==================================================
   2) Estilos para la tarjeta que contiene el formulario
   ================================================== */
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

/* ==================================================
   3) Campos con fondo oscuro tenue
   ================================================== */
.custom-field {
  margin-bottom: 20px;
  color: white;
}

/* ==================================================
   4) Botón “ACTUALIZAR ESTADO”
   ================================================== */
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

/* ==================================================
   5) Botón “REGRESAR” más compacto
   ================================================== */
.custom-back-btn {
  background-color: #fbc02d !important;
  color: black !important;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px;
  box-shadow: none;
  padding: 4px 12px !important;
  height: 36px !important;
  font-size: 0.75rem !important;
  transition: background-color 0.3s ease;
}
.custom-back-btn:hover {
  background-color: #fdd835 !important;
}

/* ==================================================
   6) Asegurarse de que las columnas del AppBar
      se distribuyan correctamente (nunca se solapen)
   ================================================== */
.navbar-container {
  position: relative;
  width: 100%;
}

/* ==================================================
   7) Si quieres ajustes adicionales en móvil (opcional)
   ================================================== */
@media (max-width: 600px) {
  /* En pantallas muy angostas, el botón REGRESAR puede
     reducir aún más su padding/tamaño */
  .custom-back-btn {
    padding: 2px 10px !important;
    height: 32px !important;
    font-size: 0.7rem !important;
  }
}
/* Estilo base del título y logo */
.navbar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  flex: 1;
}

.logo-img {
  max-width: 50px;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 600px) {
  .navbar-title {
    font-size: 1rem;
    margin: 8px 0;
    text-align: center;
  }

  .logo-img {
    max-width: 40px;
  }

  .custom-back-btn {
    font-size: 0.7rem !important;
    padding: 4px 10px !important;
    height: 32px !important;
    margin-top: 6px;
  }
}

</style>
