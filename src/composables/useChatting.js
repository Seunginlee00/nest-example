// 채팅 입력(내가 방에 있음): socket.io만 사용
// 채팅 입력(내가 방에 없음): socket.io + mqtt(알림 발행) → 내 앱이 mqtt로 구독, 알림 띄움





import {UuidFactory as api} from "@nestjs/core/inspector/uuid-factory";

export function useChatting({}) {
  const getRoomList = async (userId) =>{
    const { data } = await api.get('/chat/rooms', { params: { userId } });
    return data.roomList;
  }

  const getMemberList = async ({} = {}) =>{

    const res = await api.get('/chat/create/members');
    console.log('서버 응답:', res.data); // 응답 전체 확인
    return res.data?.members ?? []; // 없으면 빈 배열 반환
  };


  return{
    getRoomList,
    getMemberList,
  }
}
