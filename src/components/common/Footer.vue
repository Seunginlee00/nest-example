<script setup>
import { MDBFooter } from "mdb-vue-ui-kit";
</script>

<template>
  <MDBFooter
      class="w-100 py-3 mt-4 text-center"
      style="background: #fff; border-top: 1px solid #e0e7ef; font-size: 0.85rem; color: #6b7280;"
  >
    &copy; {{ new Date().getFullYear() }} MyApp. All rights reserved.
  </MDBFooter>
</template>

<style lang="scss" scoped>
/* 필요에 따라 추가 스타일 가능 */
</style>
