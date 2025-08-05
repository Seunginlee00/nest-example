<!-- src/layouts/MainLayoutShell.vue -->
<script setup>
import { computed } from "vue"
import { RouterView, useRoute } from "vue-router"
import { Layouts } from "@layouts"   // layouts/index.js 또는 layouts.js 에서 각 레이아웃 export

const route = useRoute()

const layoutComponent = computed(() => {
  const layoutName = route.meta?.layout || "Default"
  if (!Layouts[layoutName]) {
    console.warn(`[MainLayoutShell] 지정된 레이아웃이 존재하지 않습니다: ${layoutName}`);
  }
  return Layouts[layoutName] || Layouts.Default;
})
const showFooter = computed(() => !!route.meta?.showFooter)
const keepAlive = computed(() => !!route.meta?.keepAlive)
</script>

<template>
  <component :is="layoutComponent" :showFooter="showFooter">
    <router-view v-slot="{ Component }">
      <KeepAlive v-if="keepAlive">
        <component :is="Component" />
      </KeepAlive>
      <component v-else :is="Component" />
    </router-view>
  </component>
</template>
