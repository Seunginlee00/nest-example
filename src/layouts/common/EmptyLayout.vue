<!-- /src/layouts/common/EmptyLayout.vue -->
<script setup>
import { MDBContainer, MDBRow, MDBCol } from "mdb-vue-ui-kit";
// props로 footer, bgClass, centered 등 수용
defineProps({
  showFooter: { type: Boolean, default: false },
  bgClass: { type: String, default: "bg-light" },
  centered: { type: Boolean, default: true }
});
//console.log(">>> EmptyLayout 마운트됨");
</script>

<template>
  <MDBContainer :class="['min-vh-100', bgClass, 'd-flex', 'flex-column', 'p-0']" fluid>
    <MDBRow v-if="centered" class="flex-grow-1 align-items-center justify-content-center m-0">
      <MDBCol class="d-flex align-items-center justify-content-center p-0">
        <slot>
          <router-view />
        </slot>
      </MDBCol>
    </MDBRow>
    <MDBRow v-else class="flex-grow-1 m-0">
      <MDBCol class="p-0">
        <slot>
          <router-view />
        </slot>
      </MDBCol>
    </MDBRow>
    <MDBRow v-if="showFooter" class="m-0">
      <MDBCol class="text-center py-3 text-muted small">
        &copy; {{ new Date().getFullYear() }} 만사시스템 All rights reserved.
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<style lang="scss" scoped>
/* 커스텀 스타일 필요시 추가 */
</style>
