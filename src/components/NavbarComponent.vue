<template>
  <v-app-bar app color="#1a1a1a" dark height="100" class="custom-navbar">
    <v-container class="d-flex align-center justify-center">
      <!-- Usamos binding ":src" para que Vue resuelva el require() correctamente -->
      <v-img
        :src="logoImage"
        alt="Logo"
        height="75"
        width="75"
        class="mr-6"
      />

      <v-spacer />

      <!-- Botones de menú -->
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

      <!-- 🔔 Botón de notificaciones -->
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

      <!-- 🪪 Diálogo de tareas pendientes -->
      <v-dialog
        v-model="dialogTareas"
        max-width="560"
        transition="scale-transition"
        persistent
        scrollable
      >
        <v-card class="rounded-xl elevation-12 pa-4" style="background: #fffdfc">
          <div class="d-flex align-center mb-3 pb-2 border-bottom">
            <div>
              <h3 class="text-h6 font-weight-bold">Tareas Pendientes</h3>
              <span class="text-caption grey--text">
                {{ tareasPendientes.length }} tareas activas
              </span>
            </div>
          </div>

          <v-scroll-y-transition group>
            <v-list v-if="tareasPendientes.length" class="pa-0">
              <v-list-item
                v-for="(t, i) in tareasPendientes"
                :key="i"
                class="rounded-lg mb-3"
                style="background: #f4f5fa"
              >
                <div class="d-flex justify-space-between align-start w-100">
                  <div>
                    <div class="text-body-1 font-weight-medium mb-1 text-primary">
                      {{ t.descripcion }}
                    </div>
                    <div class="d-flex flex-wrap text-caption grey--text">
                      <v-icon size="16" class="mr-1">mdi-bed</v-icon>
                      Hab: {{ t.numero_Habitacion }}
                      <v-icon size="16" class="ml-4 mr-1">mdi-alert</v-icon>
                      Prioridad: {{ t.nivel_Prioridad }}
                    </div>
                  </div>

                  <div class="d-flex align-center gap-2">
                    <v-btn
                      icon
                      class="btn-circular gold-icon"
                      @click="marcarComoHecha(i)"
                      title="Marcar como hecha"
                    >
                      <v-icon color="#d4af37" size="26">mdi-check</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-list-item>
            </v-list>

            <div v-else class="text-center my-8">
              <v-icon color="green" size="48">mdi-check-all</v-icon>
              <p class="text-subtitle-1 mt-2">¡No tienes tareas pendientes!</p>
              <p class="text-caption grey--text">Disfruta tu tiempo libre ✨</p>
            </div>
          </v-scroll-y-transition>

          <div class="d-flex justify-space-between align-center mt-5 pt-3 border-top">
            <span class="text-caption grey--text">Actualizado: justo ahora</span>
            <v-btn @click="dialogTareas = false" class="boton-cerrar-gold">
              Cerrar
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- 👤 Avatar (usuario) -->
      <v-avatar size="80" class="profile-avatar" @click="dialog = true">
        <!-- En producción, userImagePath ya apunta a algo como "usuariosfotos/petra.png" -->
        <v-img :src="userImagePath" alt="Usuario" @error="onImageError" />
      </v-avatar>

      <!-- 🔐 Diálogo de Cerrar sesión -->
      <v-dialog v-model="dialog" max-width="400" persistent>
        <v-card class="logout-card rounded-xl">
          <v-card-title class="headline d-flex align-center justify-center">
            <v-img :src="logoImage" alt="Logo" height="40" class="mr-2" />
            ¿Cerrar sesión?
          </v-card-title>
          <v-card-text class="text-center">
            Puedes volver a iniciar sesión en cualquier momento.
          </v-card-text>
          <v-card-actions class="dialog-actions">
            <v-btn
              class="dialog-button logout rounded-pill"
              @click="logout"
            >
              Cerrar sesión
            </v-btn>
            <v-btn
              class="dialog-button cancel rounded-pill"
              @click="dialog = false"
            >
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// ① Importamos el logo con require
const logoImage = require('@/assets/logotiopo.png');

const router = useRouter();
const dialog = ref(false);
const dialogTareas = ref(false);
const loggedInUser = ref(localStorage.getItem('loggedInUser') || 'Invitado');
const userRole = ref(localStorage.getItem('userRole') || 'Sin rol asignado');
const menuItems = ref([]);
const tareasPendientes = ref([]);

// ② Mapeo de roles a rutas de menú
const roleMenuMapping = {
  Administrador: [
    { label: 'Habitaciones', path: '/habitaciones' },
    { label: 'Reservaciónes', path: '/resevaciones' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Tareas', path: '/tareas' },
    { label: 'Informes', path: '/informes' },
  ],
  'Empleado de Limpieza': [{ label: 'Tareas', path: '/tareas' }],
  'Supervisor de Mantenimiento': [
    { label: 'Gestión de Habitaciones', path: '/habitaciones' },
    { label: 'Tareas', path: '/tareas' },
  ],
  'Gerente de Operaciones': [
    { label: 'Gestión de Habitaciones', path: '/habitaciones' },
    { label: 'Tareas', path: '/tareas' },
    { label: 'Informes', path: '/informes' },
  ],
  'Recepcionista': [
    { label: 'Habitaciones', path: '/habitaciones' },
    { label: 'Reservaciónes', path: '/resevaciones' },
    { label: 'Clientes', path: '/clientes' },
  ],
};

// ③ Construimos la ruta relativa a la carpeta "docs/HotelCost" (ejemplo: usuariosfotos/petra.png)
const userImagePath = ref(`usuariosfotos/${loggedInUser.value}.png`);

async function marcarComoHecha(index) {
  const tarea = tareasPendientes.value[index];
  try {
    // Ajusta la URL según tu backend real en producción
    const response = await axios.delete(
      `https://localhost:7239/api/Tareas/${tarea.numero_Tarea}`
    );
    console.log('✅ Eliminada:', response.data.message);
    tareasPendientes.value.splice(index, 1);
  } catch (error) {
    console.error('❌ Error al eliminar tarea:', error);
    alert('Error al eliminar la tarea. Intenta de nuevo.');
  }
}

function onImageError(event) {
  if (event && event.target) {
    // Ruta relativa dentro de tu carpeta "docs/" (GitHub Pages)
    event.target.src = 'usuariosfotos/manuel.png';
  }
}

function navigateTo(path) {
  router.push(path);
}

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userRole');
  router.push('/');
}

onMounted(async () => {
  if (userRole.value && roleMenuMapping[userRole.value]) {
    menuItems.value = roleMenuMapping[userRole.value];
  }

  const user = localStorage.getItem('loggedInUser')?.trim();
  if (
    ['Empleado de Limpieza', 'Supervisor de Mantenimiento', 'Recepcionista', 'Gerente de Operaciones'].includes(
      userRole.value
    )
  ) {
    try {
      // Ajusta la URL según tu backend real en producción
      const res = await axios.get(`https://localhost:7239/api/Tareas/pendientes/${user}`);
      tareasPendientes.value = res.data || [];
    } catch (error) {
      console.warn('❌ Error al obtener tareas pendientes:', error.message);
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
