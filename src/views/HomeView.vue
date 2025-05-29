<template>
  <v-app>
    <NavbarComponent />
    <div class="background-container">
      <v-card class="welcome-card" elevation="10">
        <v-card-text class="text-center">
          <h2 class="text-title mb-2">¡Bienvenido, {{ formattedUser }}!</h2>
          <p class="text-subtitle">Nos alegra tenerte de vuelta en el sistema.</p>
        </v-card-text>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NavbarComponent from "@/components/NavbarComponent.vue";

const loggedInUser = ref("");

onMounted(() => {
  loggedInUser.value = localStorage.getItem("loggedInUser") || "Usuario";
});

const formattedUser = computed(() => {
  const user = loggedInUser.value;
  return user.charAt(0).toUpperCase() + user.slice(1).toLowerCase();
});
</script>

<style scoped>
.background-container {
  height: 100vh;
  background-color: #22cbc3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-card {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  max-width: 500px;
}

.text-title {
  color: #1a1a1a;
  font-weight: bold;
}

.text-subtitle {
  color: #333;
}
</style>
