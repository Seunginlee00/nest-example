<!-- src/pages/push/ModifyPage.vue -->
<template>
  <MDBContainer class="py-2 bg-white">
    <MDBRow>
      <MDBCol>
        <ModifyComponent :pno="pno" />
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script setup>
import { MDBContainer, MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import ModifyComponent from '@components/push/ModifyComponent.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pno = route.params.pno;
</script>
