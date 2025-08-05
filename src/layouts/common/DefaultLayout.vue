<!-- src/layouts/DefaultLayout.vue -->
<script setup>
import TopHeader from '@/components/common/header/TopHeader.vue';
import SidebarMenu from '@/components/common/Sidebar.vue';
import Footer from "@/components/common/Footer.vue";
import { ref } from "vue";
import { Offcanvas } from 'bootstrap';

const offcanvasRef = ref();
const showOffcanvas = () => {
  const bsOffcanvas = Offcanvas.getOrCreateInstance(offcanvasRef.value);
  bsOffcanvas.show();
};
</script>

<template>
  <div class="layout-root">
    <!-- PC Sidebar -->
    <aside class="sidebar d-none d-lg-flex">
      <SidebarMenu is-mobile="false" />
    </aside>

    <!-- 모바일 Offcanvas Sidebar -->
    <div
        ref="offcanvasRef"
        class="offcanvas offcanvas-start bg-primary text-white"
        tabindex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
        style="width:220px;"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="mobileSidebarLabel">메뉴</h5>
        <button type="button" class="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-0">
        <!-- 모바일용: 로그인/로그아웃 메뉴까지 보이도록 -->
        <SidebarMenu is-mobile="true" />
      </div>
    </div>

    <!-- Main/상단/푸터 -->
    <div class="flex-grow-1 d-flex flex-column" style="min-width:0; height: 100vh;">
      <TopHeader @open-sidebar="showOffcanvas" />
      <div class="mt-4 flex-grow-1 main-content" style="overflow:auto; min-height:0;">
        <router-view />
      </div>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.layout-root {
  display: flex;
  min-height: 100vh;
  height: 100%;
  margin: 0;
  padding: 0;
}
.main-content {
  flex: 110%;
  min-height: 0;
  overflow: auto;
  /* padding이나 margin은 필요시 추가 */
}
.sidebar {
  width: 220px;
  height: 100vh;
  background: #155e75;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  position: sticky;
  top: 0;
  z-index: 1020;
}
@media (max-width: 991.98px) {
  .sidebar {
    display: none !important;
  }
}
</style>
