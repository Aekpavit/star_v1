<template>
  <div class="flex flex-col gap-6">
    <!-- การ์ดสถิติด้านบน -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="หัวข้อการประเมิน" :value="stats.topics" />
      <StatCard label="ตัวชี้วัดทั้งหมด" :value="stats.indicators" />
      <StatCard label="ผู้รับการประเมิน" :value="stats.evaluatees" />
      <StatCard label="กรรมการผู้ประเมิน" :value="stats.evaluators" />
    </div>

    <!-- ฟอร์มสร้างผู้ประเมิน + สร้างรหัสผ่าน -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- ฝั่งซ้าย: สร้างผู้ประเมิน -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-lg mb-4">สร้างผู้ประเมิน</h2>

        <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
          <div>
            <label for="fullName" class="block text-sm text-gray-500 mb-1">
              ชื่อ-นามสกุล
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label for="email" class="block text-sm text-gray-500 mb-1">
              email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label for="position" class="block text-sm text-gray-500 mb-1">
              ตำแหน่ง
            </label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label for="department" class="block text-sm text-gray-500 mb-1">
              แผนกวิชา
            </label>
            <input
              id="department"
              v-model="form.department"
              type="text"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label for="school" class="block text-sm text-gray-500 mb-1">
              ชื่อโรงเรียน/วิทยาลัย
            </label>
            <input
              id="school"
              v-model="form.school"
              type="text"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm text-gray-500 mb-1">
              เบอร์โทร
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </form>
      </div>

      <!-- ฝั่งขวา: สร้างรหัสผ่าน -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-lg mb-4">สร้างรหัสผ่านของผู้ประเมิน</h2>

        <div class="flex flex-col gap-4">
          <div>
            <label for="password" class="block text-sm text-gray-500 mb-1">
              รหัสผ่าน
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm text-gray-500 mb-1"
            >
              ยืนยันรหัสผ่าน
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <button
            type="button"
            :disabled="isSubmitting"
            class="mt-2 bg-orange-300 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 transition-colors"
            @click="handleSubmit"
          >
            {{ isSubmitting ? "กำลังบันทึก..." : "สร้างผู้ประเมิน" }}
          </button>

          <p v-if="errorMessage" class="text-sm text-red-500">
            {{ errorMessage }}
          </p>
          <p v-if="successMessage" class="text-sm text-green-600">
            {{ successMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import StatCard from "../components/StatCard.vue";

const stats = reactive({
  topics: 7,
  indicators: 7,
  evaluatees: 7,
  evaluators: 7,
});

// ----- ฟอร์ม -----
const form = reactive({
  fullName: "",
  email: "",
  position: "",
  department: "",
  school: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

function resetForm() {
  form.fullName = "";
  form.email = "";
  form.position = "";
  form.department = "";
  form.school = "";
  form.phone = "";
  form.password = "";
  form.confirmPassword = "";
}

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.fullName || !form.email) {
    errorMessage.value = "กรุณากรอกชื่อ-นามสกุล และ email ให้ครบถ้วน";
    return;
  }

  if (!form.password || form.password !== form.confirmPassword) {
    errorMessage.value = "รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง";
    return;
  }

  isSubmitting.value = true;
  try {
    successMessage.value = "สร้างผู้ประเมินสำเร็จ";
    resetForm();
  } catch (err) {
    errorMessage.value =
      "เกิดข้อผิดพลาดในการสร้างผู้ประเมิน กรุณาลองใหม่อีกครั้ง";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
