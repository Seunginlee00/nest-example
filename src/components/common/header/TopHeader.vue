<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const openNavColor = ref(false);
const showDropdown = ref(false);
const dropdown = ref(null);

const toggleDropdown = (e) => {
  e.preventDefault();
  e.stopPropagation();
  showDropdown.value = !showDropdown.value;
};
const closeDropdownOutside = (e) => {
  if (dropdown.value && !dropdown.value.contains(e.target)) {
    showDropdown.value = false;
  }
};
onMounted(() => {
  window.addEventListener('click', closeDropdownOutside);
});
onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOutside);
});
</script>

<template>
  <nav
    class="navbar navbar-expand-lg sticky-top shadow-none border-0 p-0"
    style="background: #155e75; min-height: 56px; z-index: 1030"
  >
    <div class="container-fluid">
      <!-- 모바일(햄버거): 사이드바 오픈 -->
      <button
        class="navbar-toggler d-lg-none btn btn-primary me-2"
        type="button"
        aria-label="사이드바 열기"
        style="font-size: 2rem"
        @click="$emit('open-sidebar')"
      >
        <i class="bi bi-list"></i>
      </button>

      <!-- 로고/브랜드 -->
      <RouterLink to="/" class="navbar-brand text-light fw-bold"
        >Navbar</RouterLink
      >

      <!-- Collapse 메뉴 토글 -->
      <button
        class="navbar-toggler"
        type="button"
        @click="openNavColor = !openNavColor"
        aria-label="메뉴 열기"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapse 메뉴(모바일에서 펼쳐짐) -->
      <!-- <div :class="['collapse navbar-collapse', { show: openNavColor }]" id="topHeaderMenu">
      (필요시 카테고리 등 Collapse 내 추가 가능) -->

      <!-- 모바일(only) 로그인/로그아웃/회원정보 메뉴 -->
      <!-- <div class="ms-auto d-lg-none align-items-center gap-2 position-relative py-2">
          <template v-if="!loginStore.user?.userId">
            <RouterLink to="/auth/login">
              <button class="btn btn-outline-info w-100 mb-2" style="white-space: nowrap; min-width: 80px;">
                로그인
              </button>
            </RouterLink>
          </template>
          <template v-else>
            <div class="dropdown w-100">
              <button
                  class="btn btn-outline-info dropdown-toggle w-100"
                  type="button"
                  @click="toggleDropdown"
              >
                {{ decodeURIComponent(loginStore.user.userNm || '') }}
              </button>
              <ul
                  id="dropdown-menu-user-mobile"
                  class="dropdown-menu show"
                  :style="{ display: showDropdown ? 'block' : 'none', position: 'absolute', zIndex: 2000, left: 0, right: 0 }"
                  ref="dropdown"
              >
                <li>
                  <RouterLink to="/auth/logout" class="dropdown-item">로그아웃</RouterLink>
                </li>
                <li>
                  <RouterLink to="/auth/info" class="dropdown-item">회원정보 수정</RouterLink>
                </li>
                <li>
                  <RouterLink to="/auth/password" class="dropdown-item">비밀번호 변경</RouterLink>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div> -->

      <!-- PC(only) 우측 로그인/로그아웃/회원정보 메뉴 -->
      <!-- <div class="ms-auto d-none d-lg-flex align-items-center gap-2 position-relative">
        <template v-if="!loginStore.user?.userId">
          <RouterLink to="/member/auth/login">
            <button class="btn btn-outline-info" style="white-space: nowrap; min-width: 80px;">
              로그인
            </button>
          </RouterLink>
        </template>
        <template v-else>
          <div class="dropdown">
            <button
                class="btn btn-outline-info dropdown-toggle"
                type="button"
                @click="toggleDropdown"
            >
              {{ decodeURIComponent(loginStore.user.userNm || '') }}
            </button>
            <ul
                id="dropdown-menu-user"
                class="dropdown-menu"
                :style="{ display: showDropdown ? 'block' : 'none', position: 'absolute', zIndex: 2000, right: 0 }"
                ref="dropdown"
            >
              <li>
                <RouterLink to="/auth/logout" class="dropdown-item">로그아웃</RouterLink>
              </li>
              <li>
                <RouterLink to="/auth/info" class="dropdown-item">회원정보 수정</RouterLink>
              </li>
              <li>
                <RouterLink to="/auth/password" class="dropdown-item">비밀번호 변경</RouterLink>
              </li>
            </ul>
          </div>
        </template>
      </div> -->
    </div>
  </nav>
</template>

<style scoped>
.dropdown-menu {
  min-width: 160px;
  right: 0 !important;
  left: auto !important;
}
#dropdown-menu-user-mobile.dropdown-menu {
  min-width: 160px;
  left: 0 !important;
  right: auto !important;
}
</style>
