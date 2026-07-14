<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- ฝั่งซ้าย: กราฟ + ปฏิทิน -->
    <div class="lg:col-span-2 flex flex-col gap-6">
      <!-- กราฟ -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="text-center font-bold text-lg mb-4">สถิติการประเมิน</h2>
        <Line :data="chartData" :options="chartOptions" class="max-h-64" />
        <div class="flex justify-center gap-2 mt-4">
          <span
            v-for="(dot, i) in 3"
            :key="i"
            class="w-2 h-2 rounded-full"
            :class="i === 0 ? 'bg-gray-800' : 'bg-gray-300'"
          />
        </div>
      </div>

      <!-- ปฏิทิน -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 class="font-bold text-lg mb-2">รอบการประเมินล่าสุด</h2>
        <div class="flex gap-8 text-sm text-gray-500 mb-4">
          <span>วันเปิดระบบ วว ดด ปป วล</span>
          <span>วันปิดระบบ วว ดด ปป วล</span>
        </div>

        <!-- <div class="flex items-center justify-between mb-4">
          <button @click="prevMonth" class="text-gray-400 hover:text-gray-700">
            "‹"
          </button>
          <div class="flex gap-2">
            <select
              v-model="currentMonth"
              class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            >
              <option v-for="(m, i) in months" :key="i" :value="i">
                {{ m }}
              </option>
            </select>
            <select
              v-model="currentYear"
              class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            >
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <button @click="nextMonth" class="text-gray-400 hover:text-gray-700">
            "›"
          </button>
        </div> -->
        <div class="flex items-center justify-between mb-4">
          <button @click="prevMonth" class="text-gray-400 hover:text-gray-700">
            ‹
          </button>
          <div class="flex gap-2">
            <label for="month-select" class="sr-only">เลือกเดือน</label>
            <select
              id="month-select"
              v-model="currentMonth"
              class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            >
              <option v-for="(m, i) in months" :key="i" :value="i">
                {{ m }}
              </option>
            </select>
            <label for="year-select" class="sr-only">เลือกปี</label>
            <select
              id="year-select"
              v-model="currentYear"
              class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
            >
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
          <button @click="nextMonth" class="text-gray-400 hover:text-gray-700">
            ›
          </button>
        </div>

        <div class="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
          <span
            v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
            :key="d"
            >{{ d }}</span
          >
        </div>

        <div class="grid grid-cols-7 gap-y-2 text-center text-sm">
          <span
            v-for="(day, i) in calendarDays"
            :key="i"
            class="w-8 h-8 flex items-center justify-center rounded-full mx-auto cursor-pointer"
            :class="[
              day.currentMonth ? 'text-gray-700' : 'text-gray-300',
              day.selected ? 'bg-gray-900 text-white' : 'hover:bg-gray-100',
            ]"
            @click="selectDay(day)"
          >
            {{ day.date }}
          </span>
        </div>
      </div>
    </div>

    <!-- ฝั่งขวา: การ์ดสถิติ + รายการ -->
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-2 gap-4">
        <StatCard label="หัวข้อการประเมิน" :value="7" />
        <StatCard label="ตัวชี้วัดทั้งหมด" :value="7" />
        <StatCard label="ผู้รับการประเมิน" :value="7" />
        <StatCard label="กรรมการผู้ประเมิน" :value="7" />
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6">
        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 text-sm text-gray-500"
        >
          <span>data data data</span>
          <span>วันปิดระบบ วว ดด ปป วล</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { computed, ref } from "vue";
import { Line } from "vue-chartjs";
import StatCard from "../components/StatCard.vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

// ----- กราฟ -----
const chartData = {
  labels: [
    "Figma",
    "Sketch",
    "XD",
    "PS",
    "AI",
    "CorelD RAW",
    "InDesign",
    "Canva",
    "Webflow",
    "Affinity",
    "Marker",
    "Figma",
  ],
  datasets: [
    {
      label: "2020",
      data: [60, 90, 70, 60, 100, 70, 80, 60, 100, 40, 90, 70],
      borderColor: "#a78bfa",
      backgroundColor: "#a78bfa",
      tension: 0.4,
    },
    {
      label: "2021",
      data: [120, 100, 150, 200, 110, 130, 150, 120, 180, 90, 130, 160],
      borderColor: "#fb923c",
      backgroundColor: "#fb923c",
      tension: 0.4,
    },
    {
      label: "2022",
      data: [150, 130, 200, 250, 180, 200, 190, 220, 150, 130, 200, 220],
      borderColor: "#38bdf8",
      backgroundColor: "#38bdf8",
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 8, usePointStyle: true },
    },
  },
  scales: {
    y: { beginAtZero: true, max: 300 },
  },
};

// ----- ปฏิทิน -----
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const years = [2024, 2025, 2026];

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref(today.getDate());

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function selectDay(day) {
  if (day.currentMonth) selectedDate.value = day.date;
}

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(
    currentYear.value,
    currentMonth.value + 1,
    0,
  ).getDate();
  const daysInPrevMonth = new Date(
    currentYear.value,
    currentMonth.value,
    0,
  ).getDate();

  const days = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: daysInPrevMonth - i,
      currentMonth: false,
      selected: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: d,
      currentMonth: true,
      selected: d === selectedDate.value,
    });
  }
  while (days.length % 7 !== 0) {
    days.push({
      date: days.length - (firstDay + daysInMonth) + 1,
      currentMonth: false,
      selected: false,
    });
  }

  return days;
});
</script>
