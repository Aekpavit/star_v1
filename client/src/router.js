import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "./layouts/DashboardLayout.vue";
import Dashboard from "./views/Dashboard.vue";
import Login from "./views/login.vue";
import Regis from "./views/regis.vue";

const routes = [
  { path: "/login", component: Login },
  { path: "/regis", component: Regis },
  {
    path: "/",
    component: DashboardLayout,
    children: [
      { path: "", redirect: "/dashboard" },
      { path: "dashboard", component: Dashboard },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
