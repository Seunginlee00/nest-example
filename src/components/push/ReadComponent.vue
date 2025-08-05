<template>
  <MDBContainer class="mt-5">
    <FetchingModal v-if="fetching" />

    <MDBCard class="border border-info">
      <MDBCardBody>

        <MDBRow class="align-items-center mb-3">
          <MDBCol md="2" class="fw-bold text-start">PNO</MDBCol>
          <MDBCol md="10">
            <div class="p-3 border rounded bg-light shadow-sm">{{ product.pno }}</div>
          </MDBCol>
        </MDBRow>

        <MDBRow class="align-items-center mb-3">
          <MDBCol md="2" class="fw-bold text-start">PNAME</MDBCol>
          <MDBCol md="10">
            <div class="p-3 border rounded bg-light shadow-sm">{{ product.pname }}</div>
          </MDBCol>
        </MDBRow>

        <MDBRow class="align-items-center mb-3">
          <MDBCol md="2" class="fw-bold text-start">PRICE</MDBCol>
          <MDBCol md="10">
            <div class="p-3 border rounded bg-light shadow-sm">
              {{ product.price !== undefined && product.price !== null ? product.price.toLocaleString() : '-' }} 원
            </div>
          </MDBCol>
        </MDBRow>

        <MDBRow class="align-items-center mb-3">
          <MDBCol md="2" class="fw-bold text-start">PDESC</MDBCol>
          <MDBCol md="10">
            <div class="p-3 border rounded bg-light shadow-sm">{{ product.pdesc }}</div>
          </MDBCol>
        </MDBRow>

        <!-- 이미지 출력 -->
        <MDBRow class="mt-4 mb-4 justify-content-center">
          <MDBCol md="8" class="text-center">
            <template v-if="product.uploadFileNames && product.uploadFileNames.length">
              <img
                  v-for="(imgFile, i) in product.uploadFileNames"
                  :key="i"
                  :src="`${host}/api/products/view/${imgFile}`"
                  alt="product"
                  class="img-fluid rounded shadow mx-1 mb-4"
                  style="max-width: 80%;"
              />
            </template>
            <span v-else class="text-muted">이미지 없음</span>
          </MDBCol>
        </MDBRow>

        <!-- 버튼 -->
        <MDBRow>
          <MDBCol class="d-flex justify-content-end">
            <div class="d-flex flex-wrap gap-2">
              <MDBBtn
                  v-if="product.modifiable"
                  color="danger"
                  @click="moveToModify(product.pno)"
                  class="px-2 py-1 px-md-3 py-md-2 text-sm text-md-base"
              >
                수정
              </MDBBtn>
              <MDBBtn
                  color="primary"
                  @click="moveToList"
                  class="px-2 py-1 px-md-3 py-md-2 text-sm text-md-base"
              >
                목록
              </MDBBtn>
            </div>
          </MDBCol>
        </MDBRow>

      </MDBCardBody>
    </MDBCard>
  </MDBContainer>
</template>

<script setup>
import {
  MDBContainer, MDBRow, MDBCol,
  MDBCard, MDBCardBody, MDBBtn
} from 'mdb-vue-ui-kit';

import { ref, onMounted, watch } from 'vue';
import { useCustomMove } from '@/composables/useCustomMove';
import { getOne } from '@/api/productApi';
import { API_SERVER_HOST as host } from '@/api/hostApi';
import FetchingModal from '@/components/common/FetchingModal.vue';

const props = defineProps({
  pno: {
    type: [String, Number],
    required: true
  }
});

const { moveToList, moveToModify } = useCustomMove('push');

const product = ref({
  pno: 0,
  pname: '',
  pdesc: '',
  price: 0,
  uploadFileNames: [],
  modifiable: false,
});

const fetching = ref(false);

const fetchProduct = async () => {
  fetching.value = true;
  const data = await getOne(props.pno);
  product.value = { ...product.value, ...data }; // 값 병합으로 누락 방지
  fetching.value = false;
};

onMounted(fetchProduct);
watch(() => props.pno, fetchProduct);
</script>
