<template>
  <!-- Vue 기반 Bootstrap Modal -->
  <div
      v-if="open"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5);"
      @click.self="handleClose"
  >
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header bg-warning bg-opacity-25 border-bottom border-secondary">
          <h5 class="modal-title fs-6 text-dark">
            {{ title || 'No Title' }}
          </h5>
          <button
              type="button"
              class="btn-close"
              @click="handleClose"
              aria-label="Close"
          ></button>
        </div>

        <div class="modal-body fs-6 border-bottom border-warning py-4">
          {{ content || 'No Content' }}
        </div>

        <div class="modal-footer justify-content-end">
          <button
              type="button"
              class="btn btn-primary"
              @click="handleClose"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';

const props = defineProps({
  title: String,
  content: String,
  callbackFn: Function,
  clearModal: Function,
});

const open = ref(true);
let timer = null;

const handleClose = () => {
  open.value = false;
  if (props.callbackFn) props.callbackFn();
};

// clearModal 메서드 정의
const clearModal = () => {
  if (props.clearModal) {
    props.clearModal();
  }
  handleClose();
};

// 외부에서 접근할 수 있도록 expose
defineExpose({
  clearModal,
  handleClose
});

// ESC 키로 모달 닫기
const handleKeydown = (event) => {
  if (event.key === 'Escape' && open.value) {
    handleClose();
  }
};

onMounted(() => {
  // 5초 뒤 자동 닫힘
  timer = setTimeout(() => {
    handleClose();
  }, 5000);

  // ESC 키 이벤트 리스너 추가
  document.addEventListener('keydown', handleKeydown);

  // body에 modal-open 클래스 추가 (스크롤 방지)
  document.body.classList.add('modal-open');
});

onUnmounted(() => {
  clearTimeout(timer);
  document.removeEventListener('keydown', handleKeydown);
  document.body.classList.remove('modal-open');
});
</script>

<style scoped>
.modal.show {
  opacity: 1;
}

.modal-dialog {
  transform: none;
}

/* 애니메이션 효과 */
.modal.fade.show {
  transition: opacity 0.15s linear;
}

.modal.fade.show .modal-dialog {
  transition: transform 0.3s ease-out;
  transform: translate(0, 0);
}
</style>