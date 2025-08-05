<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
// import { LOGIN_PATH } from '@/api/hostApi';

let socket = null;
const router = useRouter();

/**
 * WebSocket 연결 및 메시지 수신 처리
 */
const connectWebSocket = () => {
  // 환경변수 활용 권장
  const wsUrl = import.meta.env.VITE_WS_URL || 'wss://your-websocket-url';
  socket = new WebSocket(wsUrl);

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);

      // if (payload.type === 'DUPLICATE_LOGIN') {
      //   // alert은 동기지만, 네이티브 alert 이후 코드 실행이 바로 이어짐.
      //   alert(payload.message || '중복 로그인이 감지되었습니다. 다시 로그인하세요.');
      //   localStorage.clear(); // 필요 시 쿠키도 삭제
      //   // replace 사용시 뒤로가기 불가
      //   router.replace(LOGIN_PATH);
      // }

      // 🔔 다른 타입 처리도 여기에서 추가 가능
    } catch (e) {
      console.warn('WebSocket JSON 파싱 실패:', e);
    }
  };

  socket.onerror = (e) => {
    console.warn('WebSocket 에러:', e);
  };
  socket.onclose = () => {
    // 필요시 재연결 로직 등 추가 가능
    socket = null;
  };
};

onMounted(() => {
  connectWebSocket();
});

onBeforeUnmount(() => {
  if (socket) {
    socket.close();
    socket = null;
  }
});
</script>

<template>
  <!-- 시각적 요소 없음 (웹소켓 리스너 역할만) -->
  <div style="display: none;"></div>
</template>
