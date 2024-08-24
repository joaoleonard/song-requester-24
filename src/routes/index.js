import { createWebHistory, createRouter } from "vue-router";

import RequestPage from "../views/RequestPage.vue";
import AdminPage from "../views/AdminPage.vue"; // Update the import path

const routes = [
  { path: "/", component: RequestPage },
  { path: "/admin", component: AdminPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
