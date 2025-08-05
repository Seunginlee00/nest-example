<script setup>
import { MDBAccordion, MDBAccordionItem, MDBListGroup, MDBListGroupItem } from "mdb-vue-ui-kit";
defineProps({
  menu: Object,
  idx: Number,
  openIndexes: Array,
  toggleAccordion: Function,
  toggleSubAccordion: Function,
  toggleMobileMenu: Function
});
</script>

<template>
  <li class="mb-2">
    <MDBAccordion v-if="menu.sub" flush :open="openIndexes[0] === idx" class="w-100">
      <MDBAccordionItem
          :header="menu.name"
          class="bg-indigo-700 text-white rounded"
          :collapse="openIndexes[0] === idx"
          @click.stop="toggleAccordion(idx)"
      >
        <MDBListGroup flush class="ps-2">
          <template v-for="(submenu, j) in menu.sub" :key="submenu.name">
            <MDBAccordion v-if="submenu.sub" flush :open="openIndexes[1] === j">
              <MDBAccordionItem
                  :header="submenu.name"
                  class="bg-indigo-500 text-indigo-50 rounded"
                  :collapse="openIndexes[1] === j"
                  @click.stop="toggleSubAccordion(j)"
              >
                <MDBListGroup flush class="ps-2">
                  <MDBListGroupItem
                      v-for="child in submenu.sub"
                      :key="child.name"
                      class="bg-indigo-400 text-indigo-100 px-4 py-2 mb-1 rounded"
                  >
                    <a
                        :href="child.link"
                        class="text-decoration-none text-indigo-100"
                        @click="toggleMobileMenu"
                    >{{ child.name }}</a>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBAccordionItem>
            </MDBAccordion>
            <MDBListGroupItem
                v-else
                class="bg-indigo-500 text-indigo-100 px-4 py-2 mb-1 rounded"
            >
              <a
                  :href="submenu.link"
                  class="text-decoration-none text-indigo-100"
                  @click="toggleMobileMenu"
              >{{ submenu.name }}</a>
            </MDBListGroupItem>
          </template>
        </MDBListGroup>
      </MDBAccordionItem>
    </MDBAccordion>
    <template v-else>
      <MDBListGroup flush>
        <MDBListGroupItem class="bg-indigo-700 text-white px-5 py-3 rounded">
          <a
              :href="menu.link"
              class="text-decoration-none text-white fw-semibold"
              @click="toggleMobileMenu"
          >{{ menu.name }}</a>
        </MDBListGroupItem>
      </MDBListGroup>
    </template>
  </li>
</template>
