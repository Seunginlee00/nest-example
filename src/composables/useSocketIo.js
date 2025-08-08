// composables/useSocketio.js
import {ref, onUnmounted} from 'vue';
import {io} from 'socket.io-client';

export function useSocketio(options = {}) {
  const socket = ref(null);
  const isConnected = ref(false);
  const messages = ref([]);

  // 기본 옵션
  const defaultOptions = {
    host: '115.68.194.78',
    port: 9000, // socket.io 서버 포트 (8083 대신 9000 권장)
    path: '/mqtt', // 서버의 socket.io path
  };
  const config = {...defaultOptions, ...options};

  function connectSocket() {
    if (socket.value) {
      return;
    }

    socket.value = io(`ws://${config.host}:${config.port}`, {
      path: config.path,
      transports: ['websocket', 'polling'],
    });
    
    socket.value.on('connect', () => {
      console.log('[SocketIO] 연결됨!!');
      isConnected.value = true;
    });
    socket.value.on('disconnect', () => {
      console.log('[SocketIO] 연결해제됨!!');
      isConnected.value = false;
    });
    socket.value.on('message', (msg) => {
      messages.value.push(msg);
    });
  }

  function sendMessage(topic, message) {
    if (!socket.value) {
      return;
    }
    socket.value.emit('publish', {topic, message});
  }

  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
    }
  });

  return {
    socket,
    isConnected,
    messages,
    connectSocket,
    sendMessage,
  };
}
