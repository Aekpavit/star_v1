<template>
  <div class="relative w-full" ref="rootEl">
    <!-- Input -->
    <div
      class="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2"
      @click="toggleOpen"
    >
      <input
        type="text"
        readonly
        :placeholder="placeholder"
        :value="displayValue"
        class="w-full cursor-pointer border-none bg-transparent text-[13px] text-gray-700 outline-none"
      />

      <svg
        class="ml-1.5 h-4 w-4 shrink-0 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path d="M3 9.5H21" stroke="currentColor" stroke-width="1.6" />
        <path
          d="M8 3V6.5"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
        <path
          d="M16 3V6.5"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <!-- Panel -->
    <div
      v-if="open"
      class="absolute left-0 top-[calc(100%+6px)] z-30 w-[260px] rounded-xl border border-gray-200 bg-white p-3 shadow-xl"
    >
      <!-- Header -->
      <div class="mb-2 flex items-center gap-1.5">
        <button
          type="button"
          @click="shiftMonth(-1)"
          class="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-base text-gray-600 transition hover:bg-gray-200"
        >
          &lsaquo;
        </button>

        <select
          v-model.number="viewMonth"
          class="flex-1 rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-700 outline-none"
        >
          <option v-for="(m, i) in monthNames" :key="m" :value="i">
            {{ m }}
          </option>
        </select>

        <select
          v-model.number="viewYear"
          class="flex-1 rounded-md border border-gray-200 bg-white px-1.5 py-1 text-xs text-gray-700 outline-none"
        >
          <option v-for="y in yearOptions" :key="y" :value="y">
            {{ y }}
          </option>
        </select>

        <button
          type="button"
          @click="shiftMonth(1)"
          class="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 text-base text-gray-600 transition hover:bg-gray-200"
        >
          &rsaquo;
        </button>
      </div>

      <!-- Week -->
      <div class="mb-1 grid grid-cols-7 text-center text-[11px] text-gray-400">
        <span v-for="d in weekdayNames" :key="d">
          {{ d }}
        </span>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 gap-0.5">
        <button
          v-for="cell in dayCells"
          :key="cell.key"
          type="button"
          @click="selectDay(cell)"
          :class="[
            'rounded-md py-1.5 text-xs transition',

            cell.inMonth ? 'text-gray-700' : 'text-gray-300',

            cell.iso === todayIso && 'border border-orange-400',

            cell.iso === modelValue && 'bg-gray-900 text-white',

            cell.iso !== modelValue && 'hover:bg-gray-100',
          ]"
        >
          {{ cell.day }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" }, // ISO 'YYYY-MM-DD' (ค.ศ.)
  placeholder: { type: String, default: "mm/dd/yyyy" },
});
const emit = defineEmits(["update:modelValue"]);

const rootEl = ref(null);
const open = ref(false);

const monthNames = [
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
const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const today = new Date();
const todayIso = toIso(today);

const initial = props.modelValue ? new Date(props.modelValue) : today;
const viewMonth = ref(initial.getMonth());
const viewYear = ref(initial.getFullYear());

const yearOptions = computed(() => {
  const base = today.getFullYear();
  const years = [];
  for (let y = base - 5; y <= base + 5; y++) years.push(y);
  return years;
});

function toIso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const displayValue = computed(() => {
  if (!props.modelValue) return "";
  const [y, m, d] = props.modelValue.split("-");
  return `${m}/${d}/${y}`;
});

const dayCells = computed(() => {
  const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(viewYear.value, viewMonth.value, 1 - startOffset);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    cells.push({
      key: i,
      day: cellDate.getDate(),
      iso: toIso(cellDate),
      inMonth: cellDate.getMonth() === viewMonth.value,
    });
  }
  return cells;
});

function shiftMonth(delta) {
  let m = viewMonth.value + delta;
  let y = viewYear.value;
  if (m < 0) {
    m = 11;
    y -= 1;
  }
  if (m > 11) {
    m = 0;
    y += 1;
  }
  viewMonth.value = m;
  viewYear.value = y;
}

function selectDay(cell) {
  if (!cell.inMonth) {
    const [y, m] = cell.iso.split("-");
    viewYear.value = Number(y);
    viewMonth.value = Number(m) - 1;
  }
  emit("update:modelValue", cell.iso);
  open.value = false;
}

function toggleOpen() {
  open.value = !open.value;
}

function handleClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) open.value = false;
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("mousedown", handleClickOutside),
);
</script>
