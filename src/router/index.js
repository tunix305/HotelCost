import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import HabitacionesView from "../views/HabitacionesView.vue";
import TareasView from "../views/TareasView.vue";
import InformesView from "@/views/InformesView.vue";
import ClienteView from "@/views/ClientesView.vue";
import ResevacionesView from "@/views/ResevacionesView.vue";
import HistorialHabitacionesView from "@/views/HistorialHabitacionesView.vue";

const routes = [
  { path: "/", name: "Login", component: LoginView },
  { path: "/home", name: "Home", component: HomeView },
  { path: "/habitaciones", name: "Habitaciones", component: HabitacionesView },
  { path: "/tareas", name: "Tareas", component: TareasView },
  { path: "/informes", name: "Informes", component: InformesView },
  { path: "/historial-habitaciones", name: "Historial", component: HistorialHabitacionesView },
  { path: "/clientes", name: "Cliente", component: ClienteView },
  { path: "/resevaciones", name: "Reservaciones", component: ResevacionesView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
