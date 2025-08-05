<script setup>
import { MDBListGroup, MDBListGroupItem } from "mdb-vue-ui-kit";
</script>

<template>
  <aside
      class="sticky top-0 min-vh-100 d-flex flex-column p-4"
      style="width: 224px; background-color: #1e293b; color: #f1f5f9;"
  >
    <MDBListGroup flush>
      <router-link to="/admin" custom v-slot="{ navigate, href, isActive }">
        <MDBListGroupItem
            tag="a"
            :href="href"
            :active="isActive"
            class="fw-bold"
            style="color: #818cf8; background: transparent; border: none;"
            @click="navigate"
        >
          관리자 메인
        </MDBListGroupItem>
      </router-link>
      <router-link to="/admin/user" custom v-slot="{ navigate, href, isActive }">
        <MDBListGroupItem
            tag="a"
            :href="href"
            :active="isActive"
            style="color: #f1f5f9; background: transparent; border: none;"
            @mouseover="e => e.target.style.color='#818cf8'"
            @mouseleave="e => e.target.style.color='#f1f5f9'"
            @click="navigate"
        >
          회원관리
        </MDBListGroupItem>
      </router-link>
    </MDBListGroup>
  </aside>
</template>

<style lang="scss" scoped>
/* 커스텀 스타일이 필요하다면 여기에 추가 */
</style>
