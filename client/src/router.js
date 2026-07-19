import { createRouter, createWebHistory } from "vue-router";
import DashboardLayout from "./layouts/DashboardLayout.vue";
import Dashboard from "./views/Dashboard.vue";
import Login from "./views/login.vue";
import PlaceholderPage from "./views/PlaceholderPage.vue";
import Regis from "./views/regis.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/regis", component: Regis },
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      { path: "", component: Dashboard },
      {
        path: "topics",
        component: PlaceholderPage,
        props: {
          title: "หัวข้อการประเมิน",
          description: "หน้าจัดการหัวข้อการประเมิน",
        },
      },
      {
        path: "indicators",
        component: PlaceholderPage,
        props: { title: "ตัวชี้วัด", description: "หน้าจัดการตัวชี้วัด" },
      },
      {
        path: "evaluators",
        component: PlaceholderPage,
        props: {
          title: "จัดการผู้ประเมิน",
          description: "หน้าจัดการผู้ประเมิน",
        },
      },
      {
        path: "receivers",
        component: PlaceholderPage,
        props: {
          title: "จัดการผู้รับการประเมิน",
          description: "หน้าจัดการผู้รับการประเมิน",
        },
      },
      {
        path: "reports",
        component: PlaceholderPage,
        props: { title: "รายงานผล", description: "หน้ารายงานผลการประเมิน" },
      },
      {
        path: "requests",
        component: PlaceholderPage,
        props: {
          title: "ร้องขอการประเมินใหม่",
          description: "หน้าร้องขอการประเมินใหม่",
        },
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
