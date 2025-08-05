<template>
  <div class="my-5 d-flex justify-content-center">
    <MDBPagination class="mb-0">
      <!-- 이전 페이지 -->
      <li
          v-if="serverData.prev"
          class="page-item mx-1 mx-md-2"
      >
        <button class="page-link" @click="movePage({ page: serverData.prevPage })">
          ◀
        </button>
      </li>

      <!-- 페이지 번호 목록 -->
      <li
          v-for="pageNum in serverData.pageNumList"
          :key="pageNum"
          class="page-item mx-1 mx-md-2"
          :class="{ active: serverData.current === pageNum }"
      >
        <button class="page-link" @click="movePage({ page: pageNum })">
          {{ pageNum }}
        </button>
      </li>

      <!-- 다음 페이지 -->
      <li
          v-if="serverData.next"
          class="page-item mx-1 mx-md-2"
      >
        <button class="page-link" @click="movePage({ page: serverData.nextPage })">
          ▶
        </button>
      </li>
    </MDBPagination>
  </div>
</template>

<script setup>
import { MDBPagination } from 'mdb-vue-ui-kit';

defineProps({
  serverData: {
    type: Object,
    required: true,
  },
  movePage: {
    type: Function,
    required: true,
  },
});
</script>
