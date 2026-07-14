import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "./layouts/DashboardLayout.vue";
import Dashboard from "./views/Dashboard.vue";
import Login from "./views/login.vue";
import Regis from "./views/regis.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/regis", component: Regis },
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [{ path: "", component: Dashboard }],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
