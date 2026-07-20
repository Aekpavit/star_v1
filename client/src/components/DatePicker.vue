<template>
  <div class="date-picker" ref="rootEl">
    <div class="date-picker__input" @click="toggleOpen">
      <input
        type="text"
        readonly
        :placeholder="placeholder"
        :value="displayValue"
      />
      <svg
        class="date-picker__icon"
        width="16"
        height="16"
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

    <div v-if="open" class="date-picker__panel">
      <div class="date-picker__header">
        <button type="button" class="date-picker__nav" @click="shiftMonth(-1)">
          &lsaquo;
        </button>

        <select v-model.number="viewMonth" class="date-picker__select">
          <option v-for="(m, i) in monthNames" :key="m" :value="i">
            {{ m }}
          </option>
        </select>

        <select v-model.number="viewYear" class="date-picker__select">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>

        <button type="button" class="date-picker__nav" @click="shiftMonth(1)">
          &rsaquo;
        </button>
      </div>

      <div class="date-picker__weekdays">
        <span v-for="d in weekdayNames" :key="d">{{ d }}</span>
      </div>

      <div class="date-picker__days">
        <button
          v-for="cell in dayCells"
          :key="cell.key"
          type="button"
          class="date-picker__day"
          :class="{
            'is-muted': !cell.inMonth,
            'is-selected': cell.iso === modelValue,
            'is-today': cell.iso === todayIso,
          }"
          @click="selectDay(cell)"
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

<style scoped>
.date-picker {
  position: relative;
  width: 100%;
}

.date-picker__input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #dcdfe4;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
  cursor: pointer;
}

.date-picker__input input {
  border: none;
  outline: none;
  font-size: 13px;
  width: 100%;
  color: #333;
  cursor: pointer;
  background: transparent;
}

.date-picker__icon {
  color: #9aa0a6;
  flex-shrink: 0;
  margin-left: 6px;
}

.date-picker__panel {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  left: 0;
  width: 260px;
  background: #fff;
  border: 1px solid #e4e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  padding: 12px;
}

.date-picker__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.date-picker__nav {
  border: none;
  background: #f2f3f5;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  color: #555;
  line-height: 1;
}

.date-picker__nav:hover {
  background: #e8eaed;
}

.date-picker__select {
  flex: 1;
  border: 1px solid #e4e7eb;
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 12px;
  color: #333;
  background: #fff;
}

.date-picker__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 11px;
  color: #9aa0a6;
  margin-bottom: 4px;
}

.date-picker__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.date-picker__day {
  border: none;
  background: transparent;
  padding: 6px 0;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #333;
}

.date-picker__day:hover {
  background: #f2f3f5;
}

.date-picker__day.is-muted {
  color: #c7cad1;
}

.date-picker__day.is-today {
  border: 1px solid #f0923b;
}

.date-picker__day.is-selected {
  background: #2b2b2b;
  color: #fff;
}
</style>
