<!-- FetchingModal.vue -->
<template>
  <MDBModal
      :model-value="modelValue"
      staticBackdrop
      tabindex="-1"
      class="d-flex align-items-center justify-content-center"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-4 p-5 text-center">
        <div class="text-warning display-5 fw-bold">
          Loading...
        </div>
      </div>
    </div>
  </MDBModal>
</template>

<script setup>
import { MDBModal } from 'mdb-vue-ui-kit';
const props = defineProps({
  modelValue: Boolean
});
</script>
