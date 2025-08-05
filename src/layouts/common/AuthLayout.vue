<!-- /src/layouts/common/AuthLayout.vue -->
<script setup>
import Footer from "@/components/common/Footer.vue";

// MDB UI Kit components
import { MDBContainer, MDBRow, MDBCol } from "mdb-vue-ui-kit";
console.log(">>> AuthLayout 마운트됨");
</script>

<template>
  <MDBContainer fluid class="d-flex flex-column min-vh-100 p-0" style="background: linear-gradient(to bottom right, #e0e7ff, #a5b4fc);">
    <MDBRow class="flex-grow-1 align-items-center justify-content-center m-0">
      <MDBCol class="d-flex align-items-center justify-content-center p-0">
        <slot />
      </MDBCol>
    </MDBRow>
    <Footer />
  </MDBContainer>
</template>

<style lang="scss" scoped>
/* 필요시 custom 스타일 추가 가능 */
</style>
