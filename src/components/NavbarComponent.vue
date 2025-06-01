<template>
  <v-app-bar app color="#1a1a1a" dark height="100" class="custom-navbar">
    <v-container class="d-flex align-center justify-center">
      <!-- Tu logo (usa ruta relativa) -->
      <v-img src="assets/logotiopo.png" alt="Logo" height="75" width="75" class="mr-6" />

      <v-spacer />

      <!-- Tus botones de menú -->
      <v-btn
        v-for="item in menuItems"
        :key="item.label"
        text
        class="nav-button"
        @click="navigateTo(item.path)"
      >
        {{ item.label }}
      </v-btn>

      <v-spacer />

      <!-- Botón de notificaciones (idéntico a tu código) -->
      <v-btn icon class="notification-btn" @click="dialogTareas = true">
        <v-icon size="30" color="white">mdi-bell-outline</v-icon>
        <v-badge
          v-if="tareasPendientes.length > 0"
          :content="tareasPendientes.length"
          color="red accent-4"
          overlap
          bordered
          class="notification-badge"
        />
      </v-btn>

      <!-- Diálogo de tareas (idéntico) -->
      <v-dialog v-model="dialogTareas" max-width="560" transition="scale-transition">
        <v-card class="rounded-xl elevation-12 pa-4" style="background: #fffdfc">
          <!-- Aquí va tu listado de tareas idéntico a tu código original -->
          …
        </v-card>
      </v-dialog>

      <!-- Avatar del usuario -->
      <!-- 🔑 Fíjate: YA NO empieza con "/" – es pura ruta relativa -->
      <v-avatar size="80" class="profile-avatar" @click="dialog = true">
        <v-img :src="userImagePath" alt="Usuario" @error="onImageError" />
      </v-avatar>

      <!-- Diálogo de logout (idéntico) -->
      <v-dialog v-model="dialog" max-width="400">
        <v-card class="logout-card rounded-xl">
          …
        </v-card>
      </v-dialog>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const dialog = ref(false);
const dialogTareas = ref(false);
const loggedInUser = ref(localStorage.getItem("loggedInUser") || "Invitado");
const userRole = ref(localStorage.getItem("userRole") || "Sin rol asignado");
const menuItems = ref([]);
const tareasPendientes = ref([]);

const roleMenuMapping = {
  Administrador: [
    { label: "Habitaciones", path: "/habitaciones" },
    { label: "Reservaciónes", path: "/resevaciones" },
    { label: "Clientes", path: "/clientes" },
    { label: "Tareas", path: "/tareas" },
    { label: "Informes", path: "/informes" },
  ],
  "Empleado de Limpieza": [{ label: "Tareas", path: "/tareas" }],
  "Supervisor de Mantenimiento": [
    { label: "Gestión de Habitaciones", path: "/habitaciones" },
    { label: "Tareas", path: "/tareas" },
  ],
  "Gerente de Operaciones": [
    { label: "Gestión de Habitaciones", path: "/habitaciones" },
    { label: "Tareas", path: "/tareas" },
    { label: "Informes", path: "/informes" },
  ],
  Recepcionista: [
    { label: "Habitaciones", path: "/habitaciones" },
    { label: "Reservaciónes", path: "/resevaciones" },
    { label: "Clientes", path: "/clientes" },
  ],
};

// Ruta reactiva para la imagen del usuario (actualizado)
const userImagePath = computed(() => {
  const user = loggedInUser.value?.trim();
  if (!user) return getImageUrl('default.png');
  
  // Limpia el nombre de usuario para la URL
  const cleanName = user.toLowerCase()
    .replace(/\s+/g, '_')  // Reemplaza espacios con _
    .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Elimina acentos
  
  return getImageUrl(`${cleanName}.png`);
});

// Función para construir la URL correcta de la imagen
function getImageUrl(filename) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}usuariosfotos/${filename}`;
}

// Manejador de errores mejorado
function onImageError(event) {
  const img = event?.target;
  if (img) {
    console.warn('Error al cargar imagen de usuario:', img.src);
    
    // Intenta cargar la imagen por defecto
    img.src = getImageUrl('default.png');
    
    // Verifica si la imagen por defecto también falla
    img.onerror = null; // Elimina el manejador para evitar bucles
  }
}

function verInformacionTarea(tarea) {
  alert(
    `📝 Descripción: ${tarea.descripcion}\n🛏 Habitación: ${tarea.numero_Habitacion}\n⚠️ Prioridad: ${tarea.nivel_Prioridad}`
  );
}

async function marcarComoHecha(index) {
  const tarea = tareasPendientes.value[index];
  try {
    await axios.delete(
      `https://hotelcost.somee.com/api/Tareas/${tarea.numero_Tarea}`
    );
    tareasPendientes.value.splice(index, 1);
  } catch (error) {
    console.error("❌ Error al eliminar tarea:", error);
    alert("Error al eliminar la tarea. Intenta de nuevo.");
  }
}

function navigateTo(path) {
  router.push(path);
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userRole");
  router.push("/");
}

onMounted(async () => {
  // Depuración: muestra información útil en consola
  console.log('Usuario actual:', loggedInUser.value);
  console.log('Ruta de imagen calculada:', userImagePath.value);
  
  if (userRole.value && roleMenuMapping[userRole.value]) {
    menuItems.value = roleMenuMapping[userRole.value];
  }

  const user = localStorage.getItem("loggedInUser")?.trim();
  if (
    [
      "Empleado de Limpieza",
      "Supervisor de Mantenimiento",
      "Recepcionista",
      "Gerente de Operaciones",
    ].includes(userRole.value)
  ) {
    try {
      const res = await axios.get(
        `https://hotelcost.somee.com/api/Tareas/pendientes/${user}`
      );
      tareasPendientes.value = res.data || [];
    } catch (error) {
      console.warn("❌ Error al obtener tareas pendientes:", error.message);
    }
  }
});
</script>

<style scoped>
.v-app-bar {
  padding: 0 50px;
  height: 100px !important;
  background-color: #1a1a1a;
}
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-app-bar {
  padding: 0 50px;
  height: 100px !important;
  background-color: #1a1a1a;
}
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-btn,
.dialog-button {
  font-size: 1.4rem;
  text-transform: none;
  font-weight: bold;
  padding: 20px 30px;
  transition: color 0.3s ease, box-shadow 0.3s ease;
}
.v-btn:hover,
.dialog-button:hover {
  color: #d4af37;
  box-shadow: 0px 3px 8px rgba(212, 175, 55, 0.8);
}
.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}
.dialog-button.logout {
  background-color: #000000;
  color: white;
  border-radius: 50px;
  height: 60px;
}
.dialog-button.cancel {
  background-color: transparent;
  border: 2px solid #000000;
  color: black;
  border-radius: 50px;
  height: 60px;
}
.logout-card {
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}
.profile-avatar {
  cursor: pointer;
  border: 2px solid white;
  transition: transform 0.2s;
}
.profile-avatar:hover {
  transform: scale(1.1);
}
.notification-btn {
  margin-right: 16px;
  position: relative;
}
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.border-top {
  border-top: 1px solid #eee;
}

/* ✅ Botones modernos */
.btn-circular {
  width: 42px;
  height: 42px;
  min-width: 42px !important;
  border-radius: 50%;
  background-color: #fff8e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.btn-circular:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.gold-icon {
  background-color: #fff8e1;
}
.gold-icon:hover {
  background-color: #fce9b2;
}
.boton-cerrar-gold {
  background: linear-gradient(to right, #d4af37, #f5d580);
  color: black;
  font-weight: bold;
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}
.boton-cerrar-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}
</style>
