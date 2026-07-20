<template>
  <div class="topic-page">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 11L12 4L21 11"
          stroke="#9aa0a6"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5 10V20H19V10"
          stroke="#9aa0a6"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="breadcrumb__sep">/</span>
      <span class="breadcrumb__current">หัวข้อการประเมิน</span>
    </div>

    <!-- Add form -->
    <form class="add-form" @submit.prevent="handleAdd">
      <div class="add-form__field add-form__field--grow">
        <label>ชื่อหัวข้อ</label>
        <input v-model.trim="form.name" type="text" placeholder="" />
      </div>

      <div class="add-form__field">
        <label>วันที่เริ่ม</label>
        <DatePicker v-model="form.startDate" />
      </div>

      <div class="add-form__field">
        <label>วันที่สิ้นสุด</label>
        <DatePicker v-model="form.endDate" />
      </div>

      <button type="submit" class="btn-add" :disabled="!form.name">
        <span class="btn-add__plus">+</span> เพิ่มหัวข้อการประเมิน
      </button>
    </form>

    <p v-if="formError" class="form-error">{{ formError }}</p>

    <!-- Search -->
    <div class="search-box">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#9aa0a6" stroke-width="1.6" />
        <path
          d="M20 20L16.5 16.5"
          stroke="#9aa0a6"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
      <input
        v-model.trim="searchQuery"
        type="text"
        placeholder="ค้นหา ชื่อหัวข้อ"
      />
    </div>

    <!-- List -->
    <div class="topic-list">
      <p v-if="filteredTopics.length === 0" class="empty-state">
        ไม่พบหัวข้อการประเมินที่ค้นหา
      </p>

      <div v-for="topic in filteredTopics" :key="topic.id" class="topic-card">
        <div class="topic-card__header">
          <template v-if="editingId === topic.id">
            <input
              v-model.trim="editForm.name"
              type="text"
              class="topic-card__edit-input"
            />
          </template>
          <template v-else>
            <span>{{ topic.name }}</span>
          </template>

          <div class="topic-card__actions">
            <template v-if="editingId === topic.id">
              <button
                type="button"
                class="icon-btn icon-btn--save"
                title="บันทึก"
                @click="saveEdit(topic)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 12L10 18L20 6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="icon-btn"
                title="ยกเลิก"
                @click="cancelEdit"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </template>
            <template v-else>
              <button
                type="button"
                class="icon-btn"
                title="แก้ไข"
                @click="startEdit(topic)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 20L4.9 16.2L15.2 5.9C15.9 5.2 17 5.2 17.7 5.9L18.1 6.3C18.8 7 18.8 8.1 18.1 8.8L7.8 19.1L4 20Z"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                class="icon-btn icon-btn--danger"
                title="ลบ"
                @click="requestDelete(topic)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 7H19"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                  <path
                    d="M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                  <path
                    d="M7 7L7.8 19C7.9 19.6 8.4 20 9 20H15C15.6 20 16.1 19.6 16.2 19L17 7"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                </svg>
              </button>
            </template>
          </div>
        </div>

        <div class="topic-card__body">
          <template v-if="editingId === topic.id">
            <div class="topic-card__edit-dates">
              <DatePicker v-model="editForm.startDate" />
              <span class="topic-card__dash">–</span>
              <DatePicker v-model="editForm.endDate" />
            </div>
          </template>
          <template v-else>
            <span class="topic-card__dates">{{
              formatRange(topic.startDate, topic.endDate)
            }}</span>
          </template>

          <div class="topic-card__right">
            <button
              type="button"
              class="status-badge"
              :class="
                topic.status === 'open'
                  ? 'status-badge--open'
                  : 'status-badge--closed'
              "
              @click="toggleStatus(topic)"
            >
              {{ topic.status === "open" ? "เปิดรับ" : "ปิดรับ" }}
            </button>

            <button
              type="button"
              class="icon-btn icon-btn--refresh"
              title="รีเฟรช"
              @click="refreshTopic(topic)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                :class="{ 'is-spinning': spinningId === topic.id }"
              >
                <path
                  d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  d="M18 4v4h-4M6 20v-4h4"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div
      v-if="pendingDelete"
      class="modal-backdrop"
      @click.self="pendingDelete = null"
    >
      <div class="modal">
        <p>ต้องการลบหัวข้อ "{{ pendingDelete.name }}" ใช่หรือไม่</p>
        <div class="modal__actions">
          <button
            type="button"
            class="btn-secondary"
            @click="pendingDelete = null"
          >
            ยกเลิก
          </button>
          <button type="button" class="btn-danger" @click="confirmDelete">
            ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import DatePicker from "../components/DatePicker.vue";

let nextId = 3;

const topics = reactive([
  {
    id: 1,
    name: "ความรับผิดชอบต่อหน้าที่",
    startDate: "2025-07-01",
    endDate: "2025-08-31",
    status: "open",
  },
  {
    id: 2,
    name: "ความรับผิดชอบต่อหน้าที่",
    startDate: "2025-07-01",
    endDate: "2025-08-31",
    status: "closed",
  },
]);

const form = reactive({ name: "", startDate: "", endDate: "" });
const formError = ref("");

const searchQuery = ref("");

const editingId = ref(null);
const editForm = reactive({ name: "", startDate: "", endDate: "" });

const pendingDelete = ref(null);
const spinningId = ref(null);

const filteredTopics = computed(() => {
  if (!searchQuery.value) return topics;
  const q = searchQuery.value.toLowerCase();
  return topics.filter((t) => t.name.toLowerCase().includes(q));
});

function toBuddhistDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${Number(y) + 543}-${m}-${d}`;
}

function formatRange(start, end) {
  return `${toBuddhistDate(start)} – ${toBuddhistDate(end)}`;
}

function handleAdd() {
  formError.value = "";
  if (!form.name) {
    formError.value = "กรุณากรอกชื่อหัวข้อ";
    return;
  }
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    formError.value = "วันที่เริ่มต้องไม่มากกว่าวันที่สิ้นสุด";
    return;
  }

  topics.unshift({
    id: nextId++,
    name: form.name,
    startDate: form.startDate,
    endDate: form.endDate,
    status: "open",
  });

  form.name = "";
  form.startDate = "";
  form.endDate = "";
}

function toggleStatus(topic) {
  topic.status = topic.status === "open" ? "closed" : "open";
}

function startEdit(topic) {
  editingId.value = topic.id;
  editForm.name = topic.name;
  editForm.startDate = topic.startDate;
  editForm.endDate = topic.endDate;
}

function cancelEdit() {
  editingId.value = null;
}

function saveEdit(topic) {
  if (!editForm.name) return;
  topic.name = editForm.name;
  topic.startDate = editForm.startDate;
  topic.endDate = editForm.endDate;
  editingId.value = null;
}

function requestDelete(topic) {
  pendingDelete.value = topic;
}

function confirmDelete() {
  const idx = topics.findIndex((t) => t.id === pendingDelete.value.id);
  if (idx !== -1) topics.splice(idx, 1);
  pendingDelete.value = null;
}

function refreshTopic(topic) {
  spinningId.value = topic.id;
  setTimeout(() => {
    spinningId.value = null;
  }, 600);
}
</script>

<style scoped>
.topic-page {
  padding: 24px 28px;
  font-family:
    "Prompt",
    "Sarabun",
    -apple-system,
    sans-serif;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9aa0a6;
  margin-bottom: 20px;
}

.breadcrumb__sep {
  color: #c7cad1;
}

.breadcrumb__current {
  color: #333;
}

/* Add form */
.add-form {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.add-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 200px;
}

.add-form__field--grow {
  flex: 1;
  min-width: 220px;
}

.add-form__field label {
  font-size: 12px;
  color: #6b7280;
}

.add-form__field input[type="text"] {
  border: 1px solid #dcdfe4;
  border-radius: 8px;
  padding: 9px 10px;
  font-size: 13px;
  outline: none;
}

.add-form__field input[type="text"]:focus {
  border-color: #f0923b;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0923b;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  height: 38px;
}

.btn-add:hover:not(:disabled) {
  background: #e0822c;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add__plus {
  font-size: 15px;
  line-height: 1;
}

.form-error {
  color: #c0392b;
  font-size: 12px;
  margin: -10px 0 16px;
}

/* Search */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dcdfe4;
  border-radius: 8px;
  padding: 9px 12px;
  width: 320px;
  margin-bottom: 20px;
  background: #fff;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 13px;
  width: 100%;
}

/* List */
.topic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  color: #9aa0a6;
  font-size: 13px;
  padding: 20px 0;
  text-align: center;
}

.topic-card {
  border: 1px solid #eee0d3;
  border-radius: 10px;
  overflow: hidden;
}

.topic-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7c99a;
  color: #7a3e1d;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
}

.topic-card__edit-input {
  border: 1px solid #d98a3f;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 13px;
  outline: none;
  flex: 1;
  margin-right: 12px;
}

.topic-card__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.topic-card__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
}

.topic-card__dates {
  font-size: 13px;
  color: #555;
}

.topic-card__edit-dates {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topic-card__dash {
  color: #9aa0a6;
}

.topic-card__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge {
  border: none;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
}

.status-badge--open {
  background: #3fae4a;
}

.status-badge--open:hover {
  background: #359640;
}

.status-badge--closed {
  background: #9b2c12;
}

.status-badge--closed:hover {
  background: #85240f;
}

/* Icon buttons */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #7a3e1d;
  cursor: pointer;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.icon-btn--danger {
  color: #c0392b;
}

.icon-btn--save {
  color: #2e8b40;
}

.icon-btn--refresh {
  color: #6b7280;
}

.is-spinning {
  animation: spin 0.6s linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: #fff;
  border-radius: 10px;
  padding: 20px 24px;
  width: 320px;
  text-align: center;
}

.modal p {
  font-size: 14px;
  color: #333;
  margin-bottom: 18px;
}

.modal__actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.btn-secondary,
.btn-danger {
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13px;
  cursor: pointer;
}

.btn-secondary {
  background: #f2f3f5;
  color: #333;
}

.btn-danger {
  background: #c0392b;
  color: #fff;
}
</style>
