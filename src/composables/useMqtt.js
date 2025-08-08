// composables/useMqtt.js (개선된 버전)
import {ref, reactive, readonly, computed, onUnmounted} from 'vue'
import mqtt from 'mqtt'

export function useMqtt(options = {}) {
  // 상태 관리
  const client = ref(null)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const connectionStatus = ref('연결 안됨')
  const messages = ref([])
  const subscribedTopics = ref(new Set())
  const connectionError = ref(null)


  // 기본 연결 설정
  const defaultConnection = {
    host: '115.68.194.237',
    port: 8083,
    protocol: 'ws',
    clientId: `mqtt_vue3_${Math.random().toString(16).substring(2, 8)}`,
    username: '',
    password: '',
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    keepalive: 60,
  }

  const connection = reactive({...defaultConnection, ...options})

  // 브로커 연결 (에러 처리 강화)
  const connectMqtt = async (connectionOptions = {}) => {
    if (isConnecting.value || isConnected.value) {
      console.warn('이미 연결되어 있거나 연결 중입니다')
      return false
    }

    isConnecting.value = true
    connectionStatus.value = '연결 중...'
    connectionError.value = null

    // 연결 옵션 병합
    const finalOptions = {...connection, ...connectionOptions}

    try {
      const connectUrl = `${finalOptions.protocol}://${finalOptions.host}:${finalOptions.port}/mqtt`

      const mqttOptions = {
        clientId: finalOptions.clientId,
        username: finalOptions.username || undefined,
        password: finalOptions.password || undefined,
        clean: finalOptions.clean,
        reconnectPeriod: finalOptions.reconnectPeriod,
        connectTimeout: finalOptions.connectTimeout,
        keepalive: finalOptions.keepalive,
      }

      console.log('MQTT 연결 시도:', connectUrl, mqttOptions)
      client.value = mqtt.connect(connectUrl, mqttOptions)

      return new Promise((resolve, reject) => {
        let connectionTimeout

        // 연결 성공
        client.value.on('connect', (connack) => {
          clearTimeout(connectionTimeout)
          isConnected.value = true
          isConnecting.value = false
          connectionStatus.value = '연결됨'
          connectionError.value = null
          console.log('MQTT 브로커에 연결되었습니다', connack)
          resolve(true)
        })

        // 메시지 수신 (안전한 처리)
        client.value.on('message', (topic, payload, packet) => {
          try {
            const message = {
              id: `${Date.now()}_${Math.random()}`,
              topic,
              payload: payload.toString(),
              qos: packet.qos || 0,
              retain: packet.retain || false,
              timestamp: new Date().toISOString(),
              receivedAt: new Date()
            }

            messages.value.push(message)

            // 메모리 관리: 1000개 초과시 오래된 메시지 제거
            if (messages.value.length > 1000) {
              messages.value = messages.value.slice(-500)
            }

            // 커스텀 이벤트 발생 (안전한 호출)
            if (finalOptions.onMessage && typeof finalOptions.onMessage
              === 'function') {
              try {
                finalOptions.onMessage(message)
              } catch (callbackError) {
                console.warn('onMessage 콜백 에러:', callbackError)
              }
            }
          } catch (messageError) {
            console.error('메시지 처리 에러:', messageError)
          }
        })

        // 연결 종료
        client.value.on('close', () => {
          isConnected.value = false
          connectionStatus.value = '연결 해제됨'
          console.log('MQTT 연결이 해제되었습니다')

          if (finalOptions.onDisconnect && typeof finalOptions.onDisconnect
            === 'function') {
            try {
              finalOptions.onDisconnect()
            } catch (callbackError) {
              console.warn('onDisconnect 콜백 에러:', callbackError)
            }
          }
        })

        // 재연결
        client.value.on('reconnect', () => {
          connectionStatus.value = '재연결 중...'
          console.log('MQTT 재연결 시도 중...')
        })

        // 오프라인
        client.value.on('offline', () => {
          connectionStatus.value = '오프라인'
          console.log('MQTT 클라이언트가 오프라인 상태입니다')
        })

        // 에러 처리 (상세한 에러 정보)
        client.value.on('error', (error) => {
          console.error('MQTT 에러:', error)
          clearTimeout(connectionTimeout)
          connectionError.value = error
          connectionStatus.value = `에러: ${error.message}`
          isConnecting.value = false

          // 에러 타입별 처리
          if (error.code === 'ECONNREFUSED') {
            connectionStatus.value = '연결 거부됨 (브로커 확인 필요)'
          } else if (error.code === 'ENOTFOUND') {
            connectionStatus.value = '호스트를 찾을 수 없음'
          } else if (error.code === 'ETIMEDOUT') {
            connectionStatus.value = '연결 시간 초과'
          }

          if (finalOptions.onError && typeof finalOptions.onError
            === 'function') {
            try {
              finalOptions.onError(error)
            } catch (callbackError) {
              console.warn('onError 콜백 에러:', callbackError)
            }
          }

          reject(error)
        })

        // 연결 타임아웃 설정
        connectionTimeout = setTimeout(() => {
          if (isConnecting.value) {
            isConnecting.value = false
            connectionStatus.value = '연결 타임아웃'
            connectionError.value = new Error('연결 타임아웃')

            if (client.value) {
              client.value.end(true)
            }

            reject(new Error('연결 타임아웃'))
          }
        }, finalOptions.connectTimeout)
      })

    } catch (error) {
      console.error('연결 실패:', error)
      connectionStatus.value = `연결 실패: ${error.message}`
      connectionError.value = error
      isConnecting.value = false
      throw error
    }
  }

  // 연결 해제 (안전한 처리)
  const disconnect = () => {
    return new Promise((resolve) => {
      if (client.value && (isConnected.value || isConnecting.value)) {
        try {
          client.value.end(true, () => {
            client.value = null
            isConnected.value = false
            isConnecting.value = false
            connectionStatus.value = '연결 해제됨'
            connectionError.value = null
            subscribedTopics.value.clear()
            console.log('MQTT 연결이 정상적으로 해제되었습니다')
            resolve()
          })
        } catch (error) {
          console.error('연결 해제 중 에러:', error)
          // 강제 정리
          client.value = null
          isConnected.value = false
          isConnecting.value = false
          connectionStatus.value = '연결 해제됨'
          subscribedTopics.value.clear()
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  // 토픽 구독 (에러 처리 강화)
  const subscribe = (topic, qos = 1) => {
    return new Promise((resolve, reject) => {
      if (!client.value || !isConnected.value) {
        const error = new Error('MQTT 클라이언트가 연결되어 있지 않습니다')
        reject(error)
        return
      }

      if (!topic || typeof topic !== 'string') {
        const error = new Error('유효하지 않은 토픽입니다')
        reject(error)
        return
      }

      try {
        client.value.subscribe(topic, {qos}, (error, granted) => {
          if (error) {
            console.error('구독 실패:', error)
            reject(error)
          } else {
            console.log(`토픽 구독 성공:`, granted)
            subscribedTopics.value.add(topic)
            resolve(granted)
          }
        })
      } catch (error) {
        console.error('구독 처리 중 에러:', error)
        reject(error)
      }
    })
  }

  // 구독 해제 (에러 처리 강화)
  const unsubscribe = (topic) => {
    return new Promise((resolve, reject) => {
      if (!client.value || !isConnected.value) {
        const error = new Error('MQTT 클라이언트가 연결되어 있지 않습니다')
        reject(error)
        return
      }

      if (!topic || typeof topic !== 'string') {
        const error = new Error('유효하지 않은 토픽입니다')
        reject(error)
        return
      }

      try {
        client.value.unsubscribe(topic, (error) => {
          if (error) {
            console.error('구독 해제 실패:', error)
            reject(error)
          } else {
            console.log(`토픽 구독 해제: ${topic}`)
            subscribedTopics.value.delete(topic)
            resolve()
          }
        })
      } catch (error) {
        console.error('구독 해제 처리 중 에러:', error)
        reject(error)
      }
    })
  }

  // 메시지 발행 (에러 처리 강화)
  const publish = (topic, message, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!client.value || !isConnected.value) {
        const error = new Error('MQTT 클라이언트가 연결되어 있지 않습니다')
        reject(error)
        return
      }

      if (!topic || typeof topic !== 'string') {
        const error = new Error('유효하지 않은 토픽입니다')
        reject(error)
        return
      }

      if (message === null || message === undefined) {
        const error = new Error('메시지가 비어있습니다')
        reject(error)
        return
      }

      const defaultPublishOptions = {qos: 1, retain: false}
      const publishOptions = {...defaultPublishOptions, ...options}

      try {
        const messageStr = typeof message === 'string' ? message
          : JSON.stringify(message)

        client.value.publish(topic, messageStr, publishOptions, (error) => {
          if (error) {
            console.error('메시지 전송 실패:', error)
            reject(error)
          } else {
            console.log(`메시지 전송 성공: ${topic}`)
            resolve()
          }
        })
      } catch (error) {
        console.error('메시지 발행 처리 중 에러:', error)
        reject(error)
      }
    })
  }

  // 메시지 목록 초기화
  const clearMessages = () => {
    try {
      messages.value = []
      console.log('메시지 목록이 초기화되었습니다')
    } catch (error) {
      console.error('메시지 초기화 중 에러:', error)
    }
  }

  // 특정 토픽의 메시지만 필터링
  const getMessagesByTopic = (topic) => {
    try {
      return messages.value.filter(msg => msg.topic === topic)
    } catch (error) {
      console.error('메시지 필터링 중 에러:', error)
      return []
    }
  }

  // 연결 정보 업데이트
  const updateConnection = (newConnection) => {
    try {
      Object.assign(connection, newConnection)
      console.log('연결 정보가 업데이트되었습니다:', newConnection)
    } catch (error) {
      console.error('연결 정보 업데이트 중 에러:', error)
    }
  }

  // 연결 상태 확인
  const isHealthy = computed(() => {
    return isConnected.value && !connectionError.value
  })

  // 재연결 시도
  const reconnect = async () => {
    if (isConnecting.value) {
      console.warn('이미 연결 시도 중입니다')
      return false
    }

    try {
      await disconnect()
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1초 대기
      return await connect()
    } catch (error) {
      console.error('재연결 실패:', error)
      throw error
    }
  }

  // 컴포넌트 언마운트 시 자동 연결 해제
  onUnmounted(() => {
    console.log('useMqtt: 컴포넌트 언마운트, 연결 정리 중...')
    disconnect().catch(error => {
      console.error('언마운트 시 연결 해제 실패:', error)
    })
  })

  // 반환할 API
  return {
    // 상태 (읽기 전용)
    client: readonly(client),
    isConnected: readonly(isConnected),
    isConnecting: readonly(isConnecting),
    connectionStatus: readonly(connectionStatus),
    connectionError: readonly(connectionError),
    messages: readonly(messages),
    subscribedTopics: readonly(subscribedTopics),
    isHealthy,

    // 설정 (수정 가능)
    connection,

    // 메서드
    connectMqtt,
    disconnect,
    reconnect,
    subscribe,
    unsubscribe,
    publish,
    clearMessages,
    getMessagesByTopic,
    updateConnection,
  }
}

// 채팅 전용 Composable (에러 처리 강화)
export function useMqttChat(chatOptions = {}) {
  const mqtt = useMqtt(chatOptions)
  const currentRoom = ref('')
  const userName = ref('Anonymous')

  // 채팅방 입장 (에러 처리)
  const joinRoom = async (roomName, userDisplayName = 'Anonymous') => {
    try {
      if (!roomName || typeof roomName !== 'string') {
        throw new Error('유효하지 않은 방 이름입니다')
      }

      currentRoom.value = roomName
      userName.value = userDisplayName

      // 채팅방 토픽 구독
      await mqtt.subscribe(`chat/${roomName}`)

      // 입장 메시지 전송
      await mqtt.publish(`chat/${roomName}`, JSON.stringify({
        type: 'join',
        user: userName.value,
        timestamp: new Date().toISOString()
      }))

      console.log(`채팅방 입장: ${roomName}, 사용자: ${userDisplayName}`)
    } catch (error) {
      console.error('채팅방 입장 실패:', error)
      throw error
    }
  }

  // 채팅방 나가기 (에러 처리)
  const leaveRoom = async () => {
    try {
      if (currentRoom.value) {
        // 나가기 메시지 전송
        await mqtt.publish(`chat/${currentRoom.value}`, JSON.stringify({
          type: 'leave',
          user: userName.value,
          timestamp: new Date().toISOString()
        }))

        // 구독 해제
        await mqtt.unsubscribe(`chat/${currentRoom.value}`)

        console.log(`채팅방 나가기: ${currentRoom.value}`)
        currentRoom.value = ''
      }
    } catch (error) {
      console.error('채팅방 나가기 실패:', error)
      throw error
    }
  }

  // 채팅 메시지 전송 (에러 처리)
  const sendChatMessage = async (message) => {
    try {
      if (!currentRoom.value) {
        throw new Error('채팅방에 입장하지 않았습니다')
      }

      if (!message || !message.trim()) {
        throw new Error('메시지가 비어있습니다')
      }

      const chatMessage = {
        type: 'message',
        user: userName.value,
        message: message.trim(),
        timestamp: new Date().toISOString()
      }

      await mqtt.publish(`chat/${currentRoom.value}`,
        JSON.stringify(chatMessage))
      console.log('채팅 메시지 전송 완료')
    } catch (error) {
      console.error('채팅 메시지 전송 실패:', error)
      throw error
    }
  }

  // 채팅 메시지만 필터링 (안전한 JSON 파싱)
  const chatMessages = computed(() => {
    try {
      return mqtt.messages.value
      .filter(msg => msg.topic.startsWith('chat/'))
      .map(msg => {
        try {
          const parsed = JSON.parse(msg.payload)
          return {...msg, parsedPayload: parsed}
        } catch (parseError) {
          console.warn('JSON 파싱 실패:', parseError)
          return {
            ...msg,
            parsedPayload: {
              type: 'message',
              message: msg.payload,
              user: 'Unknown'
            }
          }
        }
      })
    } catch (error) {
      console.error('채팅 메시지 필터링 중 에러:', error)
      return []
    }
  })

  return {
    ...mqtt,
    currentRoom: readonly(currentRoom),
    userName,
    chatMessages,
    joinRoom,
    leaveRoom,
    sendChatMessage,
  }
}
