<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const position = ref("");
const department = ref("");
const schoolName = ref("");
const phone = ref("");

const handleRegister = async () => {
  try {
    const response = await fetch(
      "http://172.16.47.113:6767/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          password: password.value,
          position: position.value,
          department: department.value,
          school_name: schoolName.value,
          phone: phone.value,
        }),
      },
    );

    const data = await response.json();
    if (response.ok) {
      alert("Registration successful. Please log in.");
      router.push("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.log(err);
    // console.error(err);
    // alert("An error occurred");
  }
};
</script>

<template>
  <div
    class="flex min-h-screen w-screen items-center justify-center bg-white px-4"
  >
    <div class="w-full max-w-sm">
      <h1 class="mb-8 text-center text-3xl font-bold text-slate-900">
        Register
      </h1>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Name</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="Your name"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Position</label
          >
          <input
            v-model="position"
            type="text"
            placeholder="posittion"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Department</label
          >
          <input
            v-model="department"
            type="text"
            placeholder="your device"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >School Name</label
          >
          <input
            v-model="schoolName"
            type="text"
            placeholder="school"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700"
            >Phone</label
          >
          <input
            v-model="phone"
            type="text"
            placeholder="enter your phone number "
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none"
          />
        </div>

        <button
          @button="handleRegister"
          type="submit"
          class="w-full rounded-md bg-orange-400 py-2.5 text-sm font-semibold text-white"
        >
          register
        </button>

        <p class="text-center text-xs text-slate-500">
          Already have an account?
          <router-link to="/login" class="ml-1 font-semibold text-blue-600"
            >Login</router-link
          >
        </p>
      </form>
    </div>
  </div>
</template>
