<template>
  <MDBContainer class="mt-5">
    <FetchingModal v-if="fetching" />
    <ResultModal
        v-if="result"
        :title="result"
        :content="resultMessage"
        :callbackFn="closeModal"
    />

    <MDBCard class="border border-info">
      <MDBCardBody>
        <!-- pname -->
        <FormRow label="Product Name">
          <MDBInput v-model="product.pname" name="pname" />
        </FormRow>

        <!-- pdesc (수정: MDBTextArea → textarea) -->
        <FormRow label="Desc">
          <textarea
              v-model="product.pdesc"
              name="pdesc"
              rows="4"
              class="form-control"
          />
        </FormRow>

        <!-- price -->
        <FormRow label="Price">
          <MDBInput v-model="product.price" name="price" type="number" />
        </FormRow>

        <!-- delFlag -->
        <FormRow label="DELETE">
          <select class="form-select" v-model="product.delFlag">
            <option :value="false">사용</option>
            <option :value="true">삭제</option>
          </select>
        </FormRow>

        <!-- files -->
        <FormRow label="Files">
          <input ref="uploadRef" type="file" multiple class="form-control" />
        </FormRow>

        <!-- 이미지 목록 -->
        <MDBRow class="mb-4">
          <MDBCol md="2" class="text-start fw-bold">Images</MDBCol>
          <MDBCol md="10">
            <MDBRow>
              <MDBCol
                  v-for="(imgFile, i) in product.uploadFileNames"
                  :key="i"
                  md="4"
                  class="text-center mb-4"
              >
                <MDBBtn color="danger" size="sm" class="mb-2" @click="deleteOldImages(imgFile)">삭제</MDBBtn>
                <img
                    :src="`${host}/api/products/view/s_${imgFile}`"
                    alt="preview"
                    class="img-fluid rounded shadow"
                />
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>

        <!-- 버튼 -->
        <MDBRow class="mt-3">
          <MDBCol>
            <div class="d-flex justify-content-end flex-wrap gap-2">
              <MDBBtn color="danger" @click="handleClickDelete">삭제</MDBBtn>
              <MDBBtn color="warning" @click="handleClickModify">수정</MDBBtn>
              <MDBBtn color="primary" @click="() => moveToList({ page: 1 })">목록</MDBBtn>
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
  MDBCard, MDBCardBody, MDBInput, MDBBtn
} from 'mdb-vue-ui-kit';
import { ref, onMounted, defineProps } from 'vue';
import { getOne, putOne, deleteOne } from '@/api/productApi';
import { API_SERVER_HOST as host } from '@/api/hostApi';
import FetchingModal from '@/components/common/FetchingModal.vue';
import ResultModal from '@/components/common/ResultModal.vue';
import { useCustomMove } from '@/composables/useCustomMove';
import FormRow from "@/components/common/FormRow.vue";

const props = defineProps({ pno: [String, Number] });
const { moveToList, moveToRead } = useCustomMove('push');

const product = ref({
  pno: 0,
  pname: '',
  pdesc: '',
  price: 0,
  delFlag: false,
  uploadFileNames: [],
});
const fetching = ref(false);
const result = ref(null);
const resultMessage = ref('');
const uploadRef = ref(null);

const fetchProduct = async () => {
  fetching.value = true;
  try {
    const res = await getOne(props.pno);
    if (!res || res.error || res.status === 403) {
      alert('조회 권한이 없거나 로그인 세션이 만료되었습니다.');
      moveToList({ page: 1 });
      return;
    }
    res.uploadFileNames ??= [];
    product.value = res;
  } catch (e) {
    alert('상품 조회 중 오류가 발생했습니다.');
    moveToList({ page: 1 });
  } finally {
    fetching.value = false;
  }
};

const deleteOldImages = (fileName) => {
  product.value.uploadFileNames = product.value.uploadFileNames.filter(f => f !== fileName);
};

const handleClickModify = async () => {
  const files = uploadRef.value?.files;
  const formData = new FormData();

  for (const file of files) {
    formData.append('files', file);
  }

  formData.append('pname', product.value.pname);
  formData.append('pdesc', product.value.pdesc);
  formData.append('price', product.value.price);
  formData.append('delFlag', product.value.delFlag);

  for (const fname of product.value.uploadFileNames) {
    formData.append('uploadFileNames', fname);
  }

  fetching.value = true;
  try {
    const res = await putOne(props.pno, formData);
    if (res.success === false) {
      alert(res.message || '수정 권한이 없습니다.');
      moveToList({ page: 1 });
      return;
    }
    result.value = 'Modified';
    resultMessage.value = res.message;
  } catch (e) {
    alert('수정 중 오류가 발생했습니다.');
  } finally {
    fetching.value = false;
  }
};

const handleClickDelete = async () => {
  fetching.value = true;
  try {
    const res = await deleteOne(props.pno);
    if (res.success === false) {
      alert(res.message || '삭제 권한이 없습니다.');
      moveToList({ page: 1 });
      return;
    }
    result.value = 'Deleted';
    resultMessage.value = res.message;
  } catch {
    alert('삭제 중 오류가 발생했습니다.');
  } finally {
    fetching.value = false;
  }
};

const closeModal = () => {
  if (result.value === 'Modified') moveToRead(props.pno);
  if (result.value === 'Deleted') moveToList({ page: 1 });
  result.value = null;
};

onMounted(fetchProduct);
</script>
