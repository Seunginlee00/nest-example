import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRoomDto } from '../dto/CreateRoomDto';
import { Response } from 'express';
import { MqttService } from './../mqtt/mqtt.service';
import { ChatGateway } from './chat.gateway';
import { CreateChatDto } from './../dto/CreateChatDto';

@Injectable()
export class ChatService implements OnModuleInit {
  private sseClients: Response[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly mqttService: MqttService,
    private readonly chatGateway: ChatGateway,
  ) {}

  async onModuleInit() {
    const client = await this.mqttService.connect(); // 연결될 때까지 기다림
    client.subscribe('chatting/#');
    client.on('message', (topic, message) => {
      console.log('MQTT:', topic, message.toString());
      this.pushToSseClients(message.toString());
    });
  }

  async createChatting(
    msg: string,
    chattingRoomId: number,
    regID: number,
    regName: string,
  ) {
    if (!msg || !chattingRoomId) return;

    const topic = `chatting/${chattingRoomId}`;
    const date = new Date();
    const inserted = await this.prisma.tb_mq_message.create({
      data: { topic, target_idx: regID, msg, reg_datetime: date },
    });

    const message = {
      mq_idx: inserted.mq_idx,
      regId: regID,
      regName,
      regDate: date.toISOString(),
      msg,
    };
    this.mqttService.getClient().publish(topic, JSON.stringify(message));
  }

  addSseClient(res: Response) {
    this.sseClients.push(res);
  }

  removeSseClient(res: Response) {
    this.sseClients = this.sseClients.filter((c) => c !== res);
  }

  private pushToSseClients(data: string) {
    this.sseClients.forEach((res) => {
      res.write(`data: ${data}\n\n`);
    });
  }

  async getChatRooms2() {
    const rooms = await this.prisma.tb_chat_room.findMany({
      where: { is_del: false },
      include: {
        chat_member: true, // 관계된 member 전부 가져오기
      },
    });

    const roomsWithMessages = await Promise.all(
      rooms.map(async (room) => {
        const latestMessage = await this.prisma.tb_mq_message.findFirst({
          where: { topic: 'chatting/' + room.topic },
          orderBy: { reg_datetime: 'desc' },
        });

        return {
          cr_idx: room.cr_idx,
          members: room.chat_member.map((m) => m.user_name),
          last_msg: latestMessage?.msg ?? '',
          last_time: latestMessage?.reg_datetime ?? '',
        };
      }),
    );

    // const rooms = this.prisma.tb_chat_room.findMany({
    //   where: { is_del: false },
    // });

    // (await rooms).map((room) => {
    //   const memberList = this.prisma.tb_chat_member.findFirst({
    //     where: { cr_idx: room.cr_idx },
    //   });

    //   const messageHis = this.prisma.tb_mq_message.findFirst({
    //     where: { topic: 'chatting/' + room.topic },
    //     orderBy: { reg_datetime: 'desc' },
    //   });
    //   return { room.cr_idx, memberList.user_name 만.., messageHis.msg}
    // });
  }

  async getChatRooms() {
    return await this.prisma.tb_chat_room.findMany({
      where: { is_del: false },
      orderBy: { reg_datetime: 'desc' },
    });
  }

  async getChatMembers(cr_idx: number) {
    return this.prisma.tb_chat_member.findMany({ where: { cr_idx } });
  }

  // 회원 리스트
  async getMemberList() {
    return this.prisma.tb_test_member.findMany({ where: { is_del: false } });
  }

  // 룸 생성

  async createRoom(chattingRoomCode: string, createRoomDto: CreateRoomDto) {
    const { userId, userName, regId } = createRoomDto;

    if (!chattingRoomCode || !userName || !regId) return;

    const date = new Date();

    // 1️⃣ 채팅방 생성
    const room = await this.prisma.tb_chat_room.create({
      data: {
        topic: chattingRoomCode,
        reg_idx: regId,
        reg_datetime: date,
        is_del: false,
      },
    });

    await this.prisma.$transaction([
      ...userId.map((uid, idx) =>
        this.prisma.tb_chat_member.create({
          data: {
            user_idx: uid,
            user_name: userName[idx],
            is_del: false,
            cr_idx: room.cr_idx,
            chat_datetime: date,
          },
        }),
      ),
    ]);
  }

  // 룸 참여자 리스트 + 룸 데이터
  async getRoomDetail(roomId: string) {
    const roomIdx = await this.prisma.tb_chat_room.findFirst({
      where: { topic: roomId },
    });

    // 병렬로 동시에 요청
    const [memberList, messages] = await Promise.all([
      this.prisma.tb_chat_member.findMany({
        where: { cr_idx: roomIdx?.cr_idx, is_del: false },
        orderBy: { cm_idx: 'desc' },
      }),
      this.prisma.tb_mq_message.findMany({
        where: { topic: 'chatting/' + roomId },
        orderBy: { reg_datetime: 'asc' },
      }),
    ]);

    console.log(messages);

    return { memberList, messages };
  }

  async sendMessage(roomId: string, createChatDto: CreateChatDto) {
    const { sender, message } = createChatDto;

    if (!roomId || !sender || !message) {
      throw new Error('roomId, sender, message는 모두 필수입니다.');
    }
    const topic = 'chatting/' + roomId;
    const saved = await this.prisma.tb_mq_message.create({
      data: {
        topic: topic,
        target_idx: sender, // 체팅방 멤버 로 추청
        msg: message,
        priority: 0,
        reg_datetime: new Date(),
      },
    });

    // 안전하게 MQTT publish
    try {
      this.mqttService.publish(
        topic,
        JSON.stringify({
          sender,
          message,
          time: saved.reg_datetime?.toISOString() ?? new Date().toISOString(),
        }),
      );
    } catch (err) {
      console.error('MQTT publish 실패', err);
    }

    // 안전하게 socket emit
    try {
      this.chatGateway.server?.emit('chat', {
        topic: topic,
        sender,
        message,
        time: saved.reg_datetime?.toISOString() ?? new Date().toISOString(),
      });
    } catch (err) {
      console.error('Socket emit 실패', err);
    }
  }
}
