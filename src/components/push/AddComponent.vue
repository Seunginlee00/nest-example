<template>
  <MDBContainer class="mt-5">
    <FetchingModal v-if="fetching" />

    <ResultModal
        v-if="result"
        title="Product Add Result"
        :content="`${result}번 등록 완료`"
        :callbackFn="closeModal"
    />

    <MDBCard class="border border-info">
      <MDBCardBody>
        <!-- Product Name -->
        <MDBRow class="align-items-center mb-4">
          <MDBCol md="2" class="text-start fw-bold">Product Name</MDBCol>
          <MDBCol md="10">
            <MDBInput v-model="product.pname" name="pname" />
          </MDBCol>
        </MDBRow>

        <!-- Desc -->
        <MDBRow class="align-items-center mb-4">
          <MDBCol md="2" class="text-start fw-bold">Desc</MDBCol>
          <MDBCol md="10">
            <!-- 수정: MDBTextArea → textarea -->
            <textarea v-model="product.pdesc" name="pdesc" rows="4" class="form-control" />
          </MDBCol>
        </MDBRow>

        <!-- Price -->
        <MDBRow class="align-items-center mb-4">
          <MDBCol md="2" class="text-start fw-bold">Price</MDBCol>
          <MDBCol md="10">
            <MDBInput v-model="product.price" name="price" type="number" />
          </MDBCol>
        </MDBRow>

        <!-- Files -->
        <MDBRow class="align-items-center mb-4">
          <MDBCol md="2" class="text-start fw-bold">Files</MDBCol>
          <MDBCol md="10">
            <input ref="uploadRef" type="file" multiple class="form-control" />
          </MDBCol>
        </MDBRow>

        <!-- 등록 버튼 -->
        <MDBRow>
          <MDBCol class="d-flex justify-content-end">
            <MDBBtn color="primary" class="px-2 py-1 px-md-4 py-md-2" @click="handleClickAdd">
              등록
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBCardBody>
    </MDBCard>
  </MDBContainer>
</template>

<script setup>
import {
  MDBContainer, MDBRow, MDBCol,
  MDBInput, MDBCard, MDBCardBody, MDBBtn
} from 'mdb-vue-ui-kit';

import { ref } from 'vue';
import { postAdd } from '@/api/productApi';
import { useCustomMove } from '@/composables/useCustomMove';
import FetchingModal from '@/components/common/FetchingModal.vue';
import ResultModal from '@/components/common/ResultModal.vue';

const product = ref({
  pname: '',
  pdesc: '',
  price: 0
});

const fetching = ref(false);
const result = ref(null);
const uploadRef = ref(null);

const { moveToList } = useCustomMove('push');

const handleClickAdd = async () => {
  const files = uploadRef.value?.files;
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file);
  }

  formData.append('pname', product.value.pname);
  formData.append('pdesc', product.value.pdesc);
  formData.append('price', product.value.price);

  try {
    fetching.value = true;
    const data = await postAdd(formData);
    result.value = data.result;
    console.log(data.result);
  } catch (e) {
    alert('등록 실패: ' + e.message);
  } finally {
    fetching.value = false;
  }
};

const closeModal = () => {
  result.value = null;
  moveToList({ page: 1 });
};
</script>
