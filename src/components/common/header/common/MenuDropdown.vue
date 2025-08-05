<script setup>
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdb-vue-ui-kit";

defineProps({
  menu: Object,
  open: Boolean,
  openSub: Number,
  idx: Number,
  setOpen: Function,
  setClose: Function,
  setSubOpen: Function,
  setSubClose: Function
});
</script>

<template>
  <MDBDropdown
      class="d-inline-block position-relative"
      @mouseenter="setOpen(idx)"
      @mouseleave="setClose"
      :show="open"
      drop="down"
  >
    <!-- 1차 메뉴 -->
    <MDBDropdownToggle
        tag="a"
        href="javascript:void(0);"
        class="px-3 py-2 fs-5 fw-medium text-white rounded-md"
        :class="{ 'bg-indigo-700 text-warning': open }"
        style="transition:all .16s;"
    >
      {{ menu.name }}
    </MDBDropdownToggle>

    <!-- 2차, 3차 서브 메뉴 -->
    <MDBDropdownMenu
        class="shadow-xl rounded-md mt-2 py-2"
        style="min-width:180px; left:0;"
        :show="open"
    >
      <template v-for="(submenu, j) in menu.sub" :key="submenu.name">
        <MDBDropdown
            v-if="submenu.sub"
            class="position-relative"
            @mouseenter="setSubOpen(j)"
            @mouseleave="setSubClose"
            :show="openSub === j"
            drop="end"
        >
          <MDBDropdownToggle
              tag="a"
              href="javascript:void(0);"
              class="d-flex align-items-center px-4 py-2 text-base text-dark bg-transparent border-0 w-100"
              :class="{ 'bg-indigo-50 text-primary': openSub === j }"
              style="transition:all .14s;"
          >
            {{ submenu.name }}
            <i class="bi bi-chevron-right ms-auto"></i>
          </MDBDropdownToggle>
          <!-- 3차 서브 -->
          <MDBDropdownMenu
              class="shadow-xl rounded-md ms-2 py-2"
              style="min-width:180px;"
              :show="openSub === j"
          >
            <MDBDropdownItem
                v-for="child in submenu.sub"
                :key="child.name"
                tag="a"
                :href="child.link"
                class="px-4 py-2 text-sm"
                style="color:#374151;"
            >
              {{ child.name }}
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
        <MDBDropdownItem
            v-else
            tag="a"
            :href="submenu.link"
            class="px-4 py-2 text-base"
            style="color:#1e293b;"
        >
          {{ submenu.name }}
        </MDBDropdownItem>
      </template>
    </MDBDropdownMenu>
  </MDBDropdown>
</template>
