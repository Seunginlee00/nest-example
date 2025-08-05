<script setup>
import { ref, computed, watch } from 'vue';
import { MDBListGroup, MDBListGroupItem, MDBCollapse } from 'mdb-vue-ui-kit';
import { useRoute } from 'vue-router';

const isAdmin = computed(() => loginStore.user?.roleNames?.includes('ADMIN'));
const adminOpen = ref(false);
const bwOpen = ref(false);
const route = useRoute();

const toggleBw = () => {
  bwOpen.value = !bwOpen.value;
};

const toggleAdmin = () => {
  adminOpen.value = !adminOpen.value;
};

// route가 member/* 계열이면 adminOpen true로 유지
watch(
  () => route.path,
  (newPath) => {
    // 병영복지 하위
    if (newPath.startsWith('/bw/')) {
      bwOpen.value = true;
    } else {
      bwOpen.value = false;
    }

    // 회원관리 하위
    if (
      newPath.startsWith('/member/user') ||
      newPath.startsWith('/member/allowHost') ||
      newPath.startsWith('/member/accessLog') ||
      newPath.startsWith('/member/manageLog') ||
      newPath.startsWith('/member/orgchart')
    ) {
      adminOpen.value = true;
    } else {
      adminOpen.value = false;
    }
  },
  { immediate: true },
);
</script>

<template>
  <aside
    class="sticky top-0 min-vh-100 d-flex flex-column p-4 border-end"
    style="width: 220px; background: rgba(21, 94, 117, 0.95)"
  >
    <MDBListGroup flush>
      <MDBListGroupItem tag="a" style="background: transparent; border: none">
        <router-link to="/" class="nav-link fw-bold">Home</router-link>
      </MDBListGroupItem>
      <MDBListGroupItem tag="a" style="background: transparent; border: none">
        <router-link to="/push/" class="nav-link">채팅</router-link>
      </MDBListGroupItem>

      <!-- <template v-if="loginStore.user?.userId"> -->
      <!-- 병영복지 메뉴 -->
      <!-- <MDBListGroupItem
            tag="a"
            @click="toggleBw"
            class="d-flex justify-content-between align-items-center"
            style="background:transparent; border:none; cursor:pointer; color: #f3f4ed;"
        >
          <span class="fw-semibold" style="color: #f3f4ed;">병영복지</span>
          <i :class="['bi', bwOpen ? 'bi-chevron-up' : 'bi-chevron-down']" style="color: #f3f4ed;"/>
        </MDBListGroupItem>
        <MDBCollapse v-model="bwOpen">
          <MDBListGroup flush class="ms-3 mt-1 mb-2">
            <MDBListGroupItem tag="a" style="background:transparent; border:none;">
              <router-link to="/bw/status" class="nav-link">병력현황</router-link>
            </MDBListGroupItem>
            <MDBListGroupItem tag="a" style="background:transparent; border:none;">
              <router-link to="/bw/location" class="nav-link">행선지 관리</router-link>
            </MDBListGroupItem>
          </MDBListGroup>
        </MDBCollapse>

        <MDBListGroupItem tag="a" style="background:transparent; border:none;">
          <router-link to="/push/" class="nav-link">채팅</router-link>
        </MDBListGroupItem> -->
      <!-- <template v-if="isAdmin">
          <MDBListGroupItem
              tag="a"
              @click="toggleAdmin"
              class="d-flex justify-content-between align-items-center"
              style="background:transparent; border:none; cursor:pointer; color: #f3f4ed;"
          >
            <span class="fw-semibold" style="color: #f3f4ed;">회원관리</span>
            <i :class="['bi', adminOpen ? 'bi-chevron-up' : 'bi-chevron-down']" style="color: #f3f4ed;"/>
          </MDBListGroupItem>
          <MDBCollapse v-model="adminOpen">
            <MDBListGroup flush class="ms-3 mt-1 mb-2">
              <MDBListGroupItem tag="a" style="background:transparent; border:none;">
                <router-link to="/member/user" class="nav-link">회원현황</router-link>
              </MDBListGroupItem>
              <MDBListGroupItem tag="a" style="background:transparent; border:none;">
                <router-link to="/member/allowHost" class="nav-link">접속IP관리</router-link>
              </MDBListGroupItem>
              <MDBListGroupItem tag="a" style="background:transparent; border:none;">
                <router-link to="/member/accessLog" class="nav-link">접속이력</router-link>
              </MDBListGroupItem>
              <MDBListGroupItem tag="a" style="background:transparent; border:none;">
                <router-link to="/member/manageLog" class="nav-link">관리이력</router-link>
              </MDBListGroupItem>
              <MDBListGroupItem tag="a" style="background:transparent; border:none;">
                <router-link to="/member/orgchart" class="nav-link">조직도</router-link>
              </MDBListGroupItem>
            </MDBListGroup>
          </MDBCollapse>
        </template> -->
      <!-- </template> -->
    </MDBListGroup>
  </aside>
</template>

<style lang="scss" scoped>
.nav-link {
  color: #f3f4ed !important; // 국방색에 잘 어울리는 밝은 텍스트
  font-weight: 500;
  transition:
    background 0.15s,
    color 0.15s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.07);
  color: #fff !important;
  border-radius: 0.375rem;
}

.MDBListGroupItem {
  background: transparent !important;
  border: none !important;
}
</style>
