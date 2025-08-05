<!-- src/App.vue -->
<script setup>
import WebSocketListener from '@/components/common/WebSocketListener.vue';
import MainLayoutShell from '@/layouts/MainLayoutShell.vue';
</script>

<template>
  <!--  <WebSocketListener />-->
  <MainLayoutShell />
</template>

<style scoped>
/* App.vue 내부 스타일은 App.css 또는 scoped로 분리 가능 */
html,
body,
#app {
  height: 100%;
  min-height: 0;
  margin: 0;
  padding: 0;
}
</style>
