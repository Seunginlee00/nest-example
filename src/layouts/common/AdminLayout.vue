<!-- src/layouts/AdminLayout.vue -->
<script setup>
import AdminSidebar from "@/components/common/AdminSidebar.vue";
import Header from "@/components/common/header/index.vue";
import Footer from "@/components/common/Footer.vue";
import { useLoginStore } from "@/store/loginStore";

// MDB UI Kit components
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdb-vue-ui-kit";
</script>

<template>
  <MDBContainer fluid class="min-vh-100 p-0 bg-light">
    <MDBRow no-gutters>
      <!-- Sidebar: md 이상에서 표시 -->
      <MDBCol md="2" class="d-none d-md-block p-0">
        <AdminSidebar />
      </MDBCol>
      <MDBCol md="10" class="p-0 flex-grow-1 d-flex flex-column">
        <Header />
        <MDBCard class="flex-grow-1 border-0 rounded-0 shadow-none">
          <MDBCardBody class="p-4">
            <slot />
          </MDBCardBody>
        </MDBCard>
        <Footer />
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<style lang="scss" scoped>
/* 필요에 따라 custom style 추가 */
</style>
