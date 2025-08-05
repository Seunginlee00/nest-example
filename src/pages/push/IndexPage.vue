<!-- src/pages/push/IndexPage.vue -->
<template>
  <MDBContainer class="py-4">
    <!-- 콘텐츠 영역 -->
    <MDBRow>
      <MDBCol>
        <router-view/>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script setup>
import {MDBContainer, MDBRow, MDBCol} from 'mdb-vue-ui-kit';
</script>
