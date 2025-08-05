<script setup>
import Header from "@/components/common/header/index.vue";
import Footer from "@/components/common/Footer.vue";
import Sidebar from "@/components/common/Sidebar.vue";

// MDB UI Kit
import { MDBContainer, MDBRow, MDBCol } from "mdb-vue-ui-kit";
</script>

<template>
  <div class="wrapper">
    <MDBContainer fluid class="d-flex min-vh-100 p-0" style="background: linear-gradient(to bottom right, #eef2ff, #c7d2fe);">
      <!-- Sidebar: md 이상에서만 표시 -->
      <Sidebar />
      <div class="flex flex-col flex-1">
        <Header />
        <MDBRow class="flex-grow-1 m-0" style="padding-top: 4rem;">
          <MDBCol class="p-0">
            <main class="flex-1 bg-white mx-auto" style="max-width: 1248px; min-height: calc(100vh - 4rem); box-sizing: border-box; padding: 12px 24px 16px;">
              <slot />
            </main>
          </MDBCol>
        </MDBRow>
        <Footer />
      </div>
    </MDBContainer>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
