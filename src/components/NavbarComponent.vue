<template>
  <v-app-bar app color="#1a1a1a" dark height="100" class="custom-navbar">
    <v-container class="d-flex align-center justify-center px-0">
      <!-- ──────────────────────────────────────────────────────────────────────────── -->
      <!-- 1) LOGO en ESCRITORIO: receptor estático (clase sólo md+), no abre nada -->
      <v-img
        src="@/assets/logotiopo.png"
        alt="Logo"
        height="75"
        width="75"
        class="mr-6 d-none d-md-flex"
      />

      <!-- 1b) LOGO en MÓVIL: dentro de un v-btn que dispara el drawer -->
      <v-btn
        icon
        class="mr-6 d-flex d-md-none"
        @click="mobileMenu = true"
      >
        <v-img
          src="@/assets/logotiopo.png"
          alt="Logo"
          height="50"
          width="50"
        />
      </v-btn>

      <!-- 2) BOTONES DE MENÚ en ESCRITORIO (md en adelante) -->
      <v-toolbar-items class="d-none d-md-flex">
        <v-btn
          v-for="item in menuItems"
          :key="item.label"
          text
          class="nav-button mx-2"
          @click="navigateTo(item.path)"
        >
          {{ item.label }}
        </v-btn>
      </v-toolbar-items>

      <v-spacer />

      <!-- 3) CAMPANITA + BADGE (nota: siempre visible en escritorio y en móvil) -->
      <v-btn icon class="notification-btn mr-4" @click="dialogTareas = true">
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

      <!-- 4) AVATAR (siempre visible) -->
      <v-avatar size="80" class="profile-avatar" @click="dialog = true">
        <v-img :src="userImagePath" alt="Usuario" @error="onImageError" />
      </v-avatar>
    </v-container>
  </v-app-bar>

  <!-- ──────────────────────────────────────────────────────────────────────────── -->
  <!-- A) DRAWER LATERAL para MÓVIL: se abre al hacer clic en el logo -->
  <v-navigation-drawer
    v-model="mobileMenu"
    app
    temporary
    class="d-flex d-md-none"
    width="240"
  >
    <v-list nav dense>
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        @click="() => { navigateTo(item.path); mobileMenu = false; }"
      >
        <v-list-item-title class="text-h6">
          {{ item.label }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- ──────────────────────────────────────────────────────────────────────────── -->
  <!-- B) DIÁLOGO DE TAREAS PENDIENTES -->
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

  <!-- ──────────────────────────────────────────────────────────────────────────── -->
  <!-- C) DIÁLOGO DE CERRAR SESIÓN -->
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
        <v-btn class="dialog-button logout rounded-pill" @click="logout">
          Cerrar sesión
        </v-btn>
        <v-btn class="dialog-button cancel rounded-pill" @click="dialog = false">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// ① Importamos el logo con require() para que Webpack lo incluya en /docs/img
const logoImage = require('@/assets/logotiopo.png');

// ② Base URL de tu API en producción
const API_BASE = 'https://www.hotelcost.somee.com/api';

const router = useRouter();
const dialog = ref(false);
const dialogTareas = ref(false);
const mobileMenu = ref(false);

const loggedInUser = ref(localStorage.getItem('loggedInUser') || 'Invitado');
const userRole = ref(localStorage.getItem('userRole') || 'Sin rol asignado');
const menuItems = ref([]);
const tareasPendientes = ref([]);

// ③ Mapeo de roles → rutas del menú (escritorio y drawer)
const roleMenuMapping = {
   Admin:[
    { label: 'Habitaciones', path: '/habitaciones' },
    { label: 'Reservaciónes', path: '/resevaciones' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Tareas', path: '/tareas' },
    { label: 'Informes', path: '/informes' },
  ],
  'Empleado de Limpieza': [{ label: 'Tareas', path: '/tareas' }],
  'Supervisor de Mantenimiento': [
    { label: 'Habitaciones', path: '/habitaciones' },
    { label: 'Tareas', path: '/tareas' },
  ],
  'Gerente de Operaciones': [
    { label: 'Habitaciones', path: '/habitaciones' },
    { label: 'Tareas', path: '/tareas' },
    { label: 'Informes', path: '/informes' },
  ],
  Recepcionista: [
    { label: 'Habitaciones', path: '/habitaciones' },
    { label: 'Reservaciónes', path: '/resevaciones' },
    { label: 'Clientes', path: '/clientes' },
  ],
};

// ④ Ruta de la foto del usuario (carpeta docs/usuariosfotos)
const userImagePath = ref(`usuariosfotos/${loggedInUser.value}.png`);

function navigateTo(path) {
  router.push(path);
}

async function marcarComoHecha(index) {
  const tarea = tareasPendientes.value[index];
  try {
    // 1) Eliminar la tarea en la API
    await axios.delete(`${API_BASE}/Tareas/${tarea.numero_Tarea}`);

    // 2) Actualizar el estado de la habitación a "Disponible"
    await axios.put(
      `${API_BASE}/Habitaciones/ActualizarEstado`,
      {
        Numero_Habitacion: tarea.numero_Habitacion, // p. ej. 102
        Estado_Actual: "Disponible"
      }
    );

    // 3) Eliminar la tarea del arreglo local para refrescar la UI
    tareasPendientes.value.splice(index, 1);
  } catch (error) {
    console.error('❌ Error al procesar la tarea o actualizar habitación:', error);
    alert('Ocurrió un error al marcar la tarea o al actualizar la habitación. Intenta de nuevo.');
  }
}


function onImageError(event) {
  if (event && event.target) {
    // Si no existe la foto, carga 'manuel.png' (en docs/usuariosfotos)
    event.target.src = 'usuariosfotos/manuel.png';
  }
}

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userRole');
  router.push('/');
}

onMounted(async () => {
  // ⑤ Construir el menú según el rol
  if (userRole.value && roleMenuMapping[userRole.value]) {
    menuItems.value = roleMenuMapping[userRole.value];
  }

  const user = localStorage.getItem('loggedInUser')?.trim();

  // ⑥ Si el rol es uno de los que reciben tareas, las pedimos
  if (
    [
      'Administrador',
      'Empleado de Limpieza',
      'Supervisor de Mantenimiento',
      'Recepcionista',
      'Gerente de Operaciones',
    ].includes(userRole.value)
  ) {
    try {
      const res = await axios.get(`${API_BASE}/Tareas/pendientes/${user}`);
      tareasPendientes.value = res.data || [];
    } catch (error) {
      console.warn('❌ Error al obtener tareas pendientes:', error.message);
    }
  }
});
</script>

<style scoped>
.v-app-bar {
  padding: 0 20px;
  background-color: #1a1a1a;
  height: 100px !important;
}
.custom-navbar .v-container {
  max-width: 100%;
  padding-left: 0;
  padding-right: 0;
}
/* Ajustamos el espaciado de los botones de menú */
.nav-button {
  font-size: 1.25rem;
  text-transform: none;
  font-weight: 600;
  color: white !important;
}
/* Bordes redondeados y sombra */
.v-navigation-drawer {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
/* Avatar con borde blanco */
.profile-avatar {
  cursor: pointer;
  border: 2px solid white;
  transition: transform 0.2s;
}
.profile-avatar:hover {
  transform: scale(1.1);
}
/* Badge de notificaciones */
.notification-btn {
  position: relative;
}
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
}
/* Botón circular para marcar tareas hechas */
.btn-circular {
  width: 42px;
  height: 42px;
  min-width: 42px !important;
  border-radius: 50%;
  background-color: #fff8e1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.btn-circular:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
/* Botón cerrar tareas e info */
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
/* Diálogo de logout */
.logout-card {
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
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
.dialog-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.border-top {
  border-top: 1px solid #eee;
}
</style>
