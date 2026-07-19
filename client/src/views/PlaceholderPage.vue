<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "หน้า",
  },
  description: {
    type: String,
    default: "ยังไม่มีเนื้อหาหน้านี้",
  },
});
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
    <h2 class="text-2xl font-semibold text-gray-800">{{ props.title }}</h2>
    <p class="mt-2 text-sm text-gray-600">{{ props.description }}</p>
  </div>
</template>
