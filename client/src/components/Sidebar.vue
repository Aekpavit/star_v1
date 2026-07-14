<template>
  <aside
    class="w-64 h-2-screen bg-white border-r border-gray-200 flex flex-col p-6"
  >
    <div class="flex items-center gap-2 mb-8">
      <span class="w-5 h-5 rounded-full bg-primary"></span>
      <h1 class="text-lg font-bold text-primary">Admin Dashboard</h1>
    </div>

    <nav class="flex flex-col gap-1 flex-1">
      <router-link
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
        active-class="!bg-primary !text-white"
      >
        <component :is="item.icon" class="w-4 h-4" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <button
      @click="logout"
      class="flex items-center gap-2 px-3 py-3 text-sm text-gray-500 hover:text-gray-700"
    >
      <LogOut class="w-4 h-4" />
      <span>ออกจากระบบ</span>
    </button>
  </aside>
</template>

<script setup>
import { FileText, Home, LogOut, Users } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();

const menu = [
  { path: "/dashboard", label: "หน้าหลัก", icon: Home },
  { path: "/topics", label: "หัวข้อการประเมิน", icon: FileText },
  { path: "/indicators", label: "ตัวชี้วัด", icon: FileText },
  { path: "/evaluators", label: "จัดการผู้ประเมิน", icon: Users },
  { path: "/receivers", label: "จัดการผู้รับการประเมิน", icon: Users },
  { path: "/reports", label: "รายงานผล", icon: FileText },
  { path: "/requests", label: "ร้องขอการประเมินใหม่", icon: FileText },
];

function logout() {
  router.push("/login");
}
</script>
