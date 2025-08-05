<!-- src/pages/push/ReadPage.vue -->
<template>
  <MDBContainer class="py-2 bg-white">
    <MDBRow>
      <MDBCol>
        <ReadComponent :pno="pno" />
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script setup>
import { MDBContainer, MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import ReadComponent from '@components/push/ReadComponent.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pno = route.params.pno;
</script>
