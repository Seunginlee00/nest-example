<template>
  <form @submit.prevent="onSearch">
    <div class="d-flex flex-wrap gap-2 align-items-center">
      <!-- 검색 조건 선택 -->
      <select
          v-model="localForm.where"
          class="form-select w-auto"
      >
        <option
            v-for="option in whereOptions"
            :key="option.value"
            :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- 검색어 입력 -->
      <input
          v-model="localForm.keyword"
          type="text"
          class="form-control"
          :placeholder="placeholder"
          style="min-width: 150px; max-width: 300px"
      />

      <!-- 검색 버튼 -->
      <button type="submit" class="btn btn-primary custom-minwidth-btn">
        검색
      </button>

      <!-- 목록 버튼 -->
      <button
          type="button"
          class="btn btn-info custom-minwidth-btn"
          @click="onReset"
      >
        목록
      </button>

      <!-- 추가 버튼 (필요 시) -->
      <button
          v-if="showAdd"
          type="button"
          class="btn btn-success custom-minwidth-btn"
          @click="onAdd"
      >
        추가
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  whereOptions: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: '검색어 입력'
  },
  showAdd: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'reset', 'add'])

const localForm = reactive({ ...props.modelValue })

// modelValue -> localForm 동기화
watch(
    () => props.modelValue,
    (newVal) => {
      Object.assign(localForm, newVal)
    }
)

// localForm -> modelValue 반영
watch(localForm, (val) => {
  emit('update:modelValue', { ...val })
}, { deep: true })

const onSearch = () => {
  // 필요 시 아래 조건 추가
  // if (!localForm.keyword.trim()) return;
  emit('search', { ...localForm })
}

const onReset = () => {
  localForm.where = props.whereOptions[0]?.value || ''
  localForm.keyword = ''
  emit('reset', { ...localForm })
}

const onAdd = () => {
  emit('add')
}
</script>

<style scoped>
.custom-minwidth-btn {
  min-width: 60px;
  padding-left: 6px;
  padding-right: 6px;
}
@media (max-width: 576px) {
  .custom-minwidth-btn {
    min-width: 45px;
    font-size: 13px;
  }
}
</style>
