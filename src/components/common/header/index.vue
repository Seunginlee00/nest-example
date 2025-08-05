<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { menus as menuData } from './menus.js';
import MenuDropdown from './common/MenuDropdown.vue';
import MenuAccordion from './common/MenuAccordion.vue';

// MDB UI Kit
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBCollapse,
  MDBContainer,
} from 'mdb-vue-ui-kit';

const menus = [...menuData]; // 로그아웃은 별도

const mobileOpen = ref(false);
const openIndexes = ref([]);
const isMobile = ref(window.innerWidth < 1024);

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024;
  mobileOpen.value = false;
  openIndexes.value = [];
};

onMounted(() => window.addEventListener('resize', handleResize));
onBeforeUnmount(() => window.removeEventListener('resize', handleResize));

// PC 드롭다운 인덱스
const pcOpen = ref(null);
const pcSubOpen = ref(null);
const openDropdown = (idx) => (pcOpen.value = idx);
const closeDropdown = () => {
  pcOpen.value = null;
  pcSubOpen.value = null;
};
const openSubDropdown = (idx) => (pcSubOpen.value = idx);
const closeSubDropdown = () => (pcSubOpen.value = null);

// 모바일 아코디언
const toggleAccordion = (idx) =>
  openIndexes.value[0] === idx
    ? (openIndexes.value = [])
    : (openIndexes.value = [idx]);
const toggleSubAccordion = (idx) =>
  openIndexes.value[1] === idx
    ? (openIndexes.value = [openIndexes.value[0]])
    : (openIndexes.value = [openIndexes.value[0], idx]);

const toggleMobileMenu = () => {
  mobileOpen.value = !mobileOpen.value;
  openIndexes.value = [];
};

const handleLogout = () => {
  auth.logout();
  // 필요하면 라우터로 이동, 토스트, etc
  mobileOpen.value = false;
  openIndexes.value = [];
};
</script>

<template>
  <MDBNavbar
    expand="lg"
    dark
    class="shadow-2xl sticky top-0 z-50 p-0"
    style="
      background: linear-gradient(
        to right,
        #1e3a8a 0%,
        #312e81 50%,
        #155e75 100%
      );
    "
  >
    <MDBContainer fluid class="px-4 mx-auto max-w-7xl">
      <!-- 로고 -->
      <router-link
        to="/"
        class="navbar-brand fs-2 fw-bold text-gradient py-2"
        style="
          background: linear-gradient(to right, #67e8f9, #a5b4fc, #c4b5fd);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        "
      >
        <span class="drop-shadow">JungA</span>
      </router-link>
      <!-- PC: 메뉴 (md 이상) -->
      <MDBCollapse :show="!isMobile ? true : mobileOpen" id="navbarMenu">
        <MDBNavbarNav class="ms-auto align-items-center gap-2 gap-lg-3">
          <template v-if="!isMobile">
            <MenuDropdown
              v-for="(menu, i) in menus"
              :key="menu.name"
              :menu="menu"
              :idx="i"
              :open="pcOpen === i"
              :openSub="pcSubOpen"
              :setOpen="openDropdown"
              :setClose="closeDropdown"
              :setSubOpen="openSubDropdown"
              :setSubClose="closeSubDropdown"
            />
            <!-- 로그아웃 버튼 -->
            <MDBNavbarItem>
              <button
                @click="handleLogout"
                class="btn btn-gradient px-4 py-2 fw-semibold ms-2"
                style="
                  background: linear-gradient(to right, #06b6d4, #2563eb);
                  color: white;
                "
              >
                <i class="bi bi-box-arrow-right me-1"></i> 로그아웃
              </button>
            </MDBNavbarItem>
          </template>
        </MDBNavbarNav>
      </MDBCollapse>

      <!-- 모바일/태블릿: 토글 버튼 -->
      <MDBNavbarToggler
        v-if="isMobile"
        @click="toggleMobileMenu"
        class="border-0 ms-auto"
        aria-label="메뉴 열기"
      />

      <!-- 모바일 메뉴 오버레이 (아코디언) -->
      <MDBCollapse v-model="mobileOpen">
        <div
          v-if="mobileOpen"
          class="w-100 px-3 py-4"
          style="
            background: linear-gradient(
              to bottom,
              #1e3a8a 0%,
              #312e81 50%,
              #155e75 100%
            );
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1040;
          "
        >
          <nav>
            <ul class="list-unstyled mb-0">
              <MenuAccordion
                v-for="(menu, i) in menus"
                :key="menu.name"
                :menu="menu"
                :idx="i"
                :openIndexes="openIndexes"
                :toggleAccordion="toggleAccordion"
                :toggleSubAccordion="toggleSubAccordion"
                :toggleMobileMenu="toggleMobileMenu"
              />
              <!-- 모바일 로그아웃 버튼 -->
              <li class="text-center mt-4">
                <button
                  @click="handleLogout"
                  class="btn btn-gradient w-75 py-3 fw-semibold"
                  style="
                    background: linear-gradient(to right, #06b6d4, #2563eb);
                    color: white;
                  "
                >
                  <i class="bi bi-box-arrow-right me-2"></i> 로그아웃
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </MDBCollapse>
    </MDBContainer>
  </MDBNavbar>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(to right, #67e8f9, #a5b4fc, #c4b5fd);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.btn-gradient {
  background: linear-gradient(to right, #06b6d4, #2563eb);
  color: white !important;
}
</style>
