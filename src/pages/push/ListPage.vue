<template>
  <MDBContainer class="py-5 bg-white">
    <MDBRow>
      <MDBCol>
        <ListComponent />
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<script setup>
import { MDBContainer, MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import ListComponent from '@components/push/ListComponent.vue';
</script>
