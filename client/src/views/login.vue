<script setup lang="ts">
import { Eye, EyeOff } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);

// const handleLogin = () => {
//   console.log({
//     username: username.value,
//     password: password.value,
//   });
// const handleLogin = async () => {
//   try {
//     const response = await fetch("http://172.16.40.93:6767/api/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         username: email.value,
//         password: password.value,
//       }),
//     });

//     const data = await response.json();

//     console.log(data);
//   } catch (err) {
//     console.error(err);
//   }
//   const data = await response.json();

//     if (response.ok) {
//       console.log("Login Success");

//       // ไปหน้า Home
//       router.push("/home");
//     } else {
//       alert(data.message);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
const handleLogin = async () => {
  try {
    const response = await fetch("http://172.16.40.93:6767/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login Success");

      router.push("/dashboard");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div
    class="flex min-h-screen w-screen items-center justify-center bg-white px-4"
  >
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-3xl font-bold text-slate-900">
        ระบบประเมินบุคลากรออนไลน์
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="text-left">
          <label
            for="email"
            class="mb-2 block text-sm font-medium text-slate-700"
          >
            email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
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
        <!-- <div>
          <div class="mb-2 flex items-center justify-between">
            <label for="password" class="text-sm font-medium text-slate-700">
              Password
            </label>
          </div>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
        </div> -->

        <!-- <button
          @click = ""
          type="submit"
          class="w-full rounded-md bg-orange-400 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          login
        </button> -->
        <button
          @button="handleLogin"
          type="submit"
          class="w-full rounded-md bg-orange-400 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Login
        </button>

        <p class="text-center text-xs text-slate-500">
          Don't Have An Account ?

          <router-link
            to="/regis"
            class="ml-1 font-semibold text-blue-600 hover:underline"
          >
            register
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>
