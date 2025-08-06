<template>
  <div class="mqtt-chat-app">
    <div class="header">
      <h1>Vue 3 + MQTT.js 채팅</h1>
      <div class="connection-status" :class="{ connected: isConnectedMqtt && isConnectedSocket }">
        MQTT: {{ isConnectedMqtt ? '연결됨' : '해제됨' }} /
        Socket.io: {{ isConnectedSocket ? '연결됨' : '해제됨' }}
      </div>
    </div>

    <!-- 연결 설정 -->
    <div class="connection-panel" v-if="!isConnectedMqtt || !isConnectedSocket">
      <h3>MQTT 브로커 연결</h3>
      <div class="form-group">
        <label>브로커 주소:</label>
        <input v-model="connection.host" placeholder="localhost"/>
      </div>
      <div class="form-group">
        <label>포트:</label>
        <input v-model="connection.port" type="number" placeholder="8083"/>
      </div>
      <div class="form-group">
        <label>사용자명:</label>
        <input
          v-model="userName"
          placeholder="닉네임을 입력하세요"
          :readonly="isUserNameFromStore"
        />
        <small v-if="isUserNameFromStore" class="user-info">
          로그인 정보에서 자동 설정됨
        </small>
      </div>
      <button @click="connectAndJoin" :disabled="isConnectingMqtt" class="connect-btn">
        {{ isConnecting ? '연결 중...' : '채팅 시작' }}
      </button>
    </div>

    <!-- 채팅 인터페이스 -->
    <div class="chat-interface" v-else>
      <div class="chat-header">
        <h3>채팅방: {{ currentRoom }}</h3>
        <button @click="leaveChatRoom" class="leave-btn">나가기</button>
      </div>

      <!-- 메시지 영역 -->
      <div class="messages-container" ref="messagesContainer">
        <div
          v-for="message in displayMessages"
          :key="message.id"
          class="message"
          :class="{
            'my-message': message.parsedPayload?.user === userName,
            'system-message': message.parsedPayload?.type !== 'message'
          }"
        >
          <div class="message-header">
            <span class="username">{{ message.parsedPayload?.user || '시스템' }}</span>
            <span class="timestamp">{{ formatTime(message.receivedAt) }}</span>
          </div>
          <div class="message-content">
            <span v-if="message.parsedPayload?.type === 'join'" class="system-text">
              {{ message.parsedPayload.user }}님이 입장했습니다.
            </span>
            <span v-else-if="message.parsedPayload?.type === 'leave'" class="system-text">
              {{ message.parsedPayload.user }}님이 퇴장했습니다.
            </span>
            <span v-else>
              {{ message.parsedPayload?.message || message.payload }}
            </span>
          </div>
        </div>
      </div>

      <!-- 메시지 입력 -->
      <div class="message-input">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="메시지를 입력하세요..."
          :disabled="!isConnectedMqtt || !isConnectedSocket"
        />
        <button @click="sendMessage"
                :disabled="!newMessage.trim() || !isConnectedMqtt || !isConnectedSocket">
          전송
        </button>
      </div>

      <!-- 디버그 정보 -->
      <div class="debug-info" v-if="showDebug">
        <h4>디버그 정보</h4>
        <p>연결된 토픽: {{ Array.from(subscribedTopics).join(', ') }}</p>
        <p>총 메시지 수: {{ messages.length }}</p>
        <button @click="clearMessages">메시지 초기화</button>
        <button @click="showDebug = false">디버그 닫기</button>
      </div>

      <button @click="showDebug = !showDebug" class="debug-toggle">
        {{ showDebug ? '디버그 숨기기' : '디버그 보기' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, nextTick, watch, onMounted} from 'vue'
import {useMqttChat} from '@/composables/useMqtt.js'
import {useSocketio} from "@/composables/useSocketIo";

// Composable 사용
const {
  isConnected: isConnectedMqtt,
  isConnecting,
  connectionStatus,
  messages: messagesMqtt,
  subscribedTopics,
  connection,
  currentRoom,
  userName,
  chatMessages,
  connectMqtt,
  joinRoom,
  leaveRoom,
  sendChatMessage,
  clearMessages,
  disconnect
} = useMqttChat({
  host: '115.68.194.78',
  port: 8083,
  onMessage: (message) => {
    console.log('새 메시지:', message)
    scrollToBottom()
  }
})

const {
  socket,
  isConnected: isConnectedSocket,
  messages: messagesSocket,
  connectSocket,
  sendMessage: sendSocketMessage,
} = useSocketio({
  host: '115.68.194.78',
  port: 9000,
});

// 로컬 상태
const newMessage = ref('')
const showDebug = ref(false)
const messagesContainer = ref(null)
const roomName = ref('general')
const isUserNameFromStore = ref(false) // 사용자명이 store에서 온 것인지 확인

// loginStore에서 사용자명 설정
onMounted(() => {
  try {
    // loginStore.user에서 사용자 정보 가져오기
    userName.value = `User_${Math.random().toString(16).substring(2, 6)}`
    isUserNameFromStore.value = false
    console.log('기본 사용자명 사용:', userName.value)
  } catch (error) {
    console.error('loginStore 접근 에러:', error)
    userName.value = `User_${Math.random().toString(16).substring(2, 6)}`
    isUserNameFromStore.value = false
  }
})

// 표시할 메시지 계산
const displayMessages = computed(() => {
  return chatMessages.value.filter(msg =>
    msg.topic === `chat/${currentRoom.value}`
  )
})

// 연결 및 채팅방 입장
const connectAndJoin = async () => {
  try {
    await connectMqtt()
    await connectSocket()
    await joinRoom(roomName.value, userName.value)
  } catch (error) {
    console.error('연결 실패:', error)
    alert(`연결 실패: ${error.message}`)
  }
}

// 채팅방 나가기
const leaveChatRoom = async () => {
  try {
    await leaveRoom()
    await disconnect()
  } catch (error) {
    console.error('채팅방 나가기 실패:', error)
  }
}

// 메시지 전송
const sendMessage = async () => {
  if (!newMessage.value.trim()) {
    return
  }

  try {
    await sendChatMessage(newMessage.value)
    newMessage.value = ''
  } catch (error) {
    console.error('메시지 전송 실패:', error)
    alert(`메시지 전송 실패: ${error.message}`)
  }
}

// 시간 포맷팅
const formatTime = (date) => {
  if (!date) {
    return ''
  }
  return new Date(date).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 스크롤을 맨 아래로
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 새 메시지가 올 때마다 스크롤
watch(
  () => displayMessages.value.length,
  () => {
    scrollToBottom()
  }
)
</script>

<style scoped>
.mqtt-chat-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  margin-bottom: 10px;
}

.connection-status {
  padding: 8px 16px;
  border-radius: 20px;
  background: #dc3545;
  color: white;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
}

.connection-status.connected {
  background: #28a745;
}

.connection-panel {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.connection-panel h3 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input[readonly] {
  background-color: #f8f9fa;
  color: #495057;
  cursor: not-allowed;
}

.user-info {
  display: block;
  margin-top: 5px;
  color: #28a745;
  font-size: 12px;
  font-style: italic;
}

.connect-btn {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.connect-btn:hover:not(:disabled) {
  background: #0056b3;
}

.connect-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.chat-interface {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  background: #007bff;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
}

.leave-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.leave-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.messages-container {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.message {
  margin-bottom: 15px;
  padding: 12px 15px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message.my-message {
  background: #e3f2fd;
  margin-left: 50px;
}

.message.system-message {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  font-style: italic;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.username {
  font-weight: 600;
  color: #007bff;
  font-size: 14px;
}

.timestamp {
  font-size: 12px;
  color: #6c757d;
}

.message-content {
  font-size: 14px;
  line-height: 1.4;
  color: #333;
}

.system-text {
  color: #856404;
  font-style: italic;
}

.message-input {
  display: flex;
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.message-input input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  margin-right: 10px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.message-input input:focus {
  outline: none;
  border-color: #007bff;
}

.message-input button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.message-input button:hover:not(:disabled) {
  background: #0056b3;
}

.message-input button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.debug-info {
  margin: 20px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 12px;
}

.debug-info h4 {
  margin-top: 0;
  color: #495057;
}

.debug-info p {
  margin: 5px 0;
  color: #6c757d;
}

.debug-info button {
  margin-right: 10px;
  margin-top: 10px;
  padding: 5px 10px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.debug-toggle {
  margin: 10px 20px;
  padding: 8px 15px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

/* 스크롤바 스타일링 */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .mqtt-chat-app {
    padding: 10px;
  }

  .connection-panel {
    padding: 20px;
  }

  .message.my-message {
    margin-left: 20px;
  }

  .chat-header {
    padding: 12px 15px;
  }

  .messages-container {
    height: 300px;
    padding: 15px;
  }

  .message-input {
    padding: 12px 15px;
  }
}
</style>
