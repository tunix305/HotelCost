<template>
  <v-app>
    <!-- Navbar mejor estructurada y alineada -->
    <v-app-bar app color="#1a1a1a" dark height="100">
      <v-container
        fluid
        class="navbar-container d-flex align-center justify-space-between px-6"
      >
        <!-- Logo alineado a la izquierda -->
        <v-img
          src="@/assets/logotiopo.png"
          alt="Logo"
          max-width="60"
          contain
          class="mr-4"
        />

        <!-- Título perfectamente centrado -->
        <div class="navbar-title">
          <span class="white--text font-weight-bold text-h6">
            Gestión de Tareas
          </span>
        </div>

        <!-- Botón de regresar -->
        <v-btn class="custom-reservar-btn" @click="goToHome">
          REGRESAR
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Contenido principal: con espacio igual a la altura del AppBar -->
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

            <!-- Botón ACTUALIZAR con mismo estilo -->
            <v-btn
              block
              class="custom-reservar-btn mt-6"
              type="submit"
            >
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
          username: u.username, // guarda el username correctamente
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
/* 1) Evita que el contenido se “pise” con el AppBar */
.tareas-fondo {
  background-color: #22cbc3;
  /* El padding-top debe ser exactamente la altura del AppBar (100px) */
  padding-top: 100px !important;
  min-height: calc(100vh - 100px);
}

/* 2) Estilos para la tarjeta que contiene el formulario */
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

/* 3) Campos con fondo oscuro tenue */
.custom-field {
  margin-bottom: 20px;
  color: white;
}

/* 4) Botón “REGRESAR” / “ACTUALIZAR” */
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

/* 5) Centrar el título en el AppBar sin que choque con el botón */
.navbar-container {
  position: relative;
}
.navbar-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 6) Asegurarse de que las columnas se distribuyan correctamente */
.v-container.d-flex {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
