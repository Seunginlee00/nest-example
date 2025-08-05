<!-- src/pages/AccessDenied.vue -->
<template>
  <div style="padding: 2rem; color: red;">
    <h3>접속 차단</h3>
    <p>
      귀하의 IP <strong>{{ ip }}</strong>는 허용되지 않았습니다.
    </p>
  </div>
</template>

<script setup>
defineProps({
  ip: String
});
</script>
