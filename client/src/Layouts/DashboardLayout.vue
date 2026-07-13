<template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Header />
      <main class="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";
</script>
