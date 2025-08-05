<script setup>
const navLinks = [
  { to: "/", label: "메인" },
  { to: "/mypage", label: "마이페이지" },
  { to: "/profile/1", label: "프로필" },
  { to: "/sidebar", label: "사이드바메인" },
  { to: "/sidebarNo", label: "빈페이지" },
  { to: "/admin", label: "관리자" }
];

// MDB UI Kit
import { MDBNavbar, MDBNavbarNav, MDBNavbarItem } from "mdb-vue-ui-kit";
</script>

<template>
  <MDBNavbar
      class="d-none d-md-flex justify-content-center px-3 py-3 mb-3 shadow rounded-bottom-4"
      style="background: linear-gradient(to right, #e0e7ff, #f5f3ff 30%, #c7d2fe 90%); border-bottom: 1px solid #c7d2fe;"
  >
    <MDBNavbarNav class="gap-3">
      <MDBNavbarItem v-for="nav in navLinks" :key="nav.to" class="px-1">
        <router-link
            :to="nav.to"
            class="px-4 py-2 fw-bold rounded-3 text-indigo-700 transition"
            style="font-size: 1.1rem;"
            active-class="bg-indigo-200 text-violet-800 shadow"
        >
          {{ nav.label }}
        </router-link>
      </MDBNavbarItem>
    </MDBNavbarNav>
  </MDBNavbar>
  <!-- 모바일 네비게이션은 별도 하단 플로팅 등 권장 -->
</template>

<style lang="scss" scoped>
/* 추가 커스텀 필요시 여기에 작성 */
</style>
