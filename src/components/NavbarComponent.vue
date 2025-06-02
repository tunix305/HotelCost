<template>
  <v-app-bar app color="#1a1a1a" dark class="custom-navbar">
    <!-- Versión móvil - Botón hamburguesa -->
    <v-app-bar-nav-icon 
      v-if="isMobile"
      @click.stop="drawer = !drawer"
      class="d-flex d-md-none"
    >
      <v-img 
        :src="logoImage" 
        alt="Menu" 
        height="40" 
        width="40"
      />
    </v-app-bar-nav-icon>

    <!-- Logo - Visible en todas las versiones -->
    <v-img 
      :src="logoImage" 
      alt="Logo" 
      height="60" 
      width="60"
      class="ml-2"
      :class="{ 'mx-auto': isMobile }"
    />

    <!-- Espacio para centrar elementos en móvil -->
    <v-spacer v-if="isMobile" />

    <!-- Versión móvil - Iconos de notificación y perfil -->
    <div v-if="isMobile" class="d-flex align-center">
      <v-btn icon class="notification-btn mr-2" @click="dialogTareas = true">
        <v-icon size="25" color="white">mdi-bell-outline</v-icon>
        <v-badge
          v-if="tareasPendientes.length > 0"
          :content="tareasPendientes.length"
          color="red accent-4"
          overlap
          bordered
        />
      </v-btn>

      <v-avatar size="40" class="profile-avatar mr-2" @click="dialog = true">
        <v-img :src="userImagePath" alt="Usuario" @error="onImageError" />
      </v-avatar>
    </div>

    <!-- Versión escritorio - Menú completo -->
    <div v-else class="d-flex align-center flex-grow-1">
      <v-spacer />

      <v-btn
        v-for="item in menuItems"
        :key="item.label"
        text
        class="nav-button mx-1"
        @click="navigateTo(item.path)"
      >
        {{ item.label }}
      </v-btn>

      <v-spacer />

      <v-btn icon class="notification-btn mx-2" @click="dialogTareas = true">
        <v-icon size="28" color="white">mdi-bell-outline</v-icon>
        <v-badge
          v-if="tareasPendientes.length > 0"
          :content="tareasPendientes.length"
          color="red accent-4"
          overlap
          bordered
        />
      </v-btn>

      <v-avatar size="50" class="profile-avatar ml-2" @click="dialog = true">
        <v-img :src="userImagePath" alt="Usuario" @error="onImageError" />
      </v-avatar>
    </div>

    <!-- Menú lateral para móviles -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      fixed
      right
      width="280"
      class="d-md-none"
    >
      <v-list dense nav>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="userImagePath" @error="onImageError" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ loggedInUser }}</v-list-item-title>
            <v-list-item-subtitle>{{ userRole }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          v-for="item in menuItems"
          :key="item.label"
          @click="navigateTo(item.path)"
        >
          <v-list-item-icon>
            <v-icon small>mdi-chevron-right</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon color="error" small>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="error--text">Cerrar sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Diálogo de Tareas (compartido) -->
    <v-dialog v-model="dialogTareas" max-width="560" scrollable>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center">
          <v-icon large color="primary" class="mr-2">mdi-bell</v-icon>
          <span>Tareas Pendientes</span>
          <v-spacer />
          <v-btn icon @click="dialogTareas = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list v-if="tareasPendientes.length > 0">
            <v-list-item
              v-for="(tarea, index) in tareasPendientes"
              :key="index"
              class="mb-2"
            >
              <v-list-item-content>
                <v-list-item-title>{{ tarea.descripcion }}</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center mt-1">
                  <v-icon small class="mr-1">mdi-bed</v-icon>
                  Hab. {{ tarea.numero_Habitacion }}
                  <v-icon small class="ml-3 mr-1">mdi-alert</v-icon>
                  {{ tarea.nivel_Prioridad }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  icon
                  color="success"
                  @click="marcarComoHecha(index)"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <div v-else class="text-center py-6">
            <v-icon color="success" size="60">mdi-check-circle</v-icon>
            <p class="subtitle-1 mt-3">¡No hay tareas pendientes!</p>
          </div>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text @click="dialogTareas = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Cerrar Sesión (compartido) -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="justify-center">
          <v-icon color="warning" large class="mr-2">mdi-alert</v-icon>
          Confirmar
        </v-card-title>

        <v-card-text class="text-center">
          ¿Estás seguro que deseas cerrar sesión?
        </v-card-text>

        <v-card-actions class="justify-center pb-4">
          <v-btn
            color="grey"
            text
            @click="dialog = false"
            class="mr-4"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="logout"
          >
            Cerrar Sesión
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useDisplay } from 'vuetify';

const { mobile: isMobile } = useDisplay();
const router = useRouter();
const drawer = ref(false);
const dialog = ref(false);
const dialogTareas = ref(false);
const loggedInUser = ref(localStorage.getItem('loggedInUser') || 'Invitado');
const userRole = ref(localStorage.getItem('userRole') || 'Sin rol asignado');
const menuItems = ref([]);
const tareasPendientes = ref([]);

const logoImage = require('@/assets/logotiopo.png');

const roleMenuMapping = {
  Administrador: [
    { label: 'Habitaciones', path: '/habitaciones' },
    { label: 'Reservaciones', path: '/reservaciones' },
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
    { label: 'Reservaciones', path: '/reservaciones' },
    { label: 'Clientes', path: '/clientes' },
  ],
};

const userImagePath = computed(() => {
  const user = loggedInUser.value?.trim();
  if (!user) return '/usuariosfotos/default.png';
  
  const cleanName = user.toLowerCase()
    .replace(/\s+/g, '_')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  return `/usuariosfotos/${cleanName}.png`;
});

async function marcarComoHecha(index) {
  const tarea = tareasPendientes.value[index];
  try {
    await axios.delete(`https://hotelcost.somee.com/api/Tareas/${tarea.numero_Tarea}`);
    tareasPendientes.value.splice(index, 1);
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    alert('Error al eliminar la tarea. Intenta de nuevo.');
  }
}

function onImageError(event) {
  if (event?.target) {
    event.target.src = '/usuariosfotos/default.png';
  }
}

function navigateTo(path) {
  router.push(path);
  drawer.value = false;
}

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('userRole');
  router.push('/login');
  dialog.value = false;
}

onMounted(async () => {
  if (userRole.value && roleMenuMapping[userRole.value]) {
    menuItems.value = roleMenuMapping[userRole.value];
  }

  const user = localStorage.getItem('loggedInUser')?.trim();
  const rolesConTareas = [
    'Empleado de Limpieza',
    'Supervisor de Mantenimiento',
    'Recepcionista',
    'Gerente de Operaciones',
    'Administrador'
  ];

  if (user && rolesConTareas.includes(userRole.value)) {
    try {
      const res = await axios.get(`https://hotelcost.somee.com/api/Tareas/pendientes/${user}`);
      tareasPendientes.value = res.data || [];
    } catch (error) {
      console.warn('Error al obtener tareas pendientes:', error.message);
    }
  }
});
</script>

<style scoped>
.custom-navbar {
  padding: 0 10px;
}

/* Estilos para móviles */
@media (max-width: 960px) {
  .custom-navbar {
    height: 70px !important;
  }
  
  .profile-avatar {
    width: 40px !important;
    height: 40px !important;
    border: 1px solid white;
  }
  
  .notification-btn {
    margin-right: 8px;
  }
}

/* Estilos para escritorio */
@media (min-width: 960px) {
  .custom-navbar {
    height: 80px !important;
    padding: 0 20px;
  }
  
  .nav-button {
    font-size: 1rem;
    padding: 12px 16px;
    margin: 0 4px;
  }
}

/* Estilos comunes */
.profile-avatar {
  cursor: pointer;
  border: 2px solid white;
  transition: transform 0.2s;
}

.profile-avatar:hover {
  transform: scale(1.1);
}

.notification-btn {
  position: relative;
}

.v-navigation-drawer {
  background-color: #1a1a1a !important;
}

.v-list-item {
  color: white !important;
}

.v-list-item:hover {
  background-color: #333 !important;
}

.v-divider {
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>