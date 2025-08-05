<!-- src/pages/ErrorPage.vue -->
<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-lg-6">
        <div class="border p-4 text-center rounded shadow-sm">
          <h4 class="mb-4 text-danger">잘못된 접근입니다.</h4>
          <p class="mb-4">
            홈페이지에 비정상적으로 접근하셨습니다.<br />
            정상적인 방법으로 사용하시기 바랍니다.
          </p>
          <button type="button" class="btn btn-info" @click="goHome">
            <b>Home</b>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => {
  router.push('/');
};

const year = new Date().getFullYear();
</script>
