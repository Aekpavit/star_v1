<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3"
  >
    <div
      class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center"
    >
      <User class="w-5 h-5 text-orange-400" />
    </div>
    <div>
      <p class="text-xs text-gray-400">{{ label }}</p>
      <p class="text-lg font-bold">
        {{ value }} <span class="text-xs font-normal text-gray-400">คน</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { User } from "lucide-vue-next";

defineProps({
  label: String,
  value: [String, Number],
});
</script>
