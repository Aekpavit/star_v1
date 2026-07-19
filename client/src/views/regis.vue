<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { ref } from "vue";

const username = ref("");
const email = ref("");
const name = ref("");
const position = ref("");
const department = ref("");
const schoolName = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = async () => {
  if (!username.value || !password.value || !confirmPassword.value) {
    alert("Please fill all fields");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Password does not match");
    return;
  }

  try {
    const response = await fetch("http://172.16.40.93:6767/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        email: email.value,
        name: name.value,
        position: position.value,
        department: department.value,
        school_name: schoolName.value,
        phone: phone.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Register failed");
      return;
    }

    alert("Register Success!");
    console.log(data);
  } catch (error) {
    console.error(error);
    alert("Cannot connect to server");
  }
};
</script>

<template>
  <div
    class="flex min-h-screen w-screen items-center justify-center bg-white px-4"
  >
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-3xl font-bold text-slate-900">
        สมัครสมาชิก
      </h1>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="text-left">
          <label
            for="username"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div class="text-left">
          <label
            for="email"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div class="text-left">
          <label
            for="name"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            Full Name
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter your full name"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div class="text-left">
          <label
            for="position"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            Position
          </label>
          <input
            id="position"
            v-model="position"
            type="text"
            placeholder="Enter your position"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div class="text-left">
          <label
            for="department"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            Department
          </label>
          <input
            id="department"
            v-model="department"
            type="text"
            placeholder="Enter your department"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div class="text-left">
          <label
            for="schoolName"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            School Name
          </label>
          <input
            id="schoolName"
            v-model="schoolName"
            type="text"
            placeholder="Enter your school name"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div class="text-left">
          <label
            for="phone"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="Enter your phone number"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div>
          <div class="mb-2 flex items-center justify-between">
            <label for="password" class="text-sm font-medium text-slate-700">
              Password
            </label>
          </div>

          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
              class="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-700"
            >
              <Eye v-if="!showPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <div>
          <div class="mb-2 flex items-center justify-between">
            <label
              for="confirmPassword"
              class="text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>
          </div>

          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              required
              class="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />

            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-700"
            >
              <Eye v-if="!showConfirmPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="w-full rounded-md bg-orange-400 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          register
        </button>

        <p class="text-center text-xs text-slate-500">
          Already Have An Account ?
          <router-link
            to="/login"
            class="ml-1 font-semibold text-blue-600 hover:underline"
          >
            login
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>
