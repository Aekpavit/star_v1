<script setup lang="ts">
import { ref } from "vue";

const username = ref("");
const password = ref("");

const handleLogin = () => {
  console.log({
    username: username.value,
    password: password.value,
  });
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-4">
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-3xl font-bold text-slate-900">
        Login to your account
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <!-- <label class="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label> -->
          <label class="text-sm font-medium text-slate-700">
            user or email
          </label>

          <input
            v-model="username"
            type="email"
            placeholder="Enter your email"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div>
          <div class="mb-2 flex items-center justify-between">
            <label class="text-sm font-medium text-slate-700"> Password </label>

            <button type="button" class="text-xs text-blue-600 hover:underline">
              Forgot?
            </button>
            <!-- don't action ค่อยใส่' -->
          </div>

          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <button
          type="submit"
          class="w-full rounded-md bg-orange-400 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          login
        </button>

        <p class="text-center text-xs text-slate-500">
          Don't Have An Account ?

          <button
            type="button"
            class="ml-1 font-semibold text-blue-600 hover:underline"
          >
            sign up
          </button>
        </p>
      </form>
    </div>
  </div>
</template>
