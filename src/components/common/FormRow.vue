<template>
  <div class="row mb-3 align-items-center">
    <label class="col-md-2 fw-bold text-md-end">{{ label }}</label>
    <div class="col-md-10">
      <slot>
        {{ value }}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormRow',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    }
  }
};
</script>

<style scoped>
/* 필요 시 row 간격 스타일 조절 */
</style>
