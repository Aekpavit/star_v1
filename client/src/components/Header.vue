<template>
  <header
    class="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shadow-sm"
  >
    <button
      class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
    >
      <span
        class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
      >
        <User class="h-5 w-5 text-gray-500" />
      </span>

      <span class="text-sm font-medium text-gray-700"> แอดมิน </span>

      <ChevronDown class="h-4 w-4 text-gray-500" />
    </button>
  </header>
</template>

<script setup>
import { ChevronDown, User } from "lucide-vue-next";
</script>
