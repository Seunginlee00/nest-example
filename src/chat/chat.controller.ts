import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  Req,
  Render,
  Param,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';
import { CreateRoomDto } from '../dto/CreateRoomDto';
import { CreateChatDto } from '../dto/CreateChatDto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService, // 🔥 여기 주입
  ) {}

  // 룸 생성 페이지 렌더링
  @Get('room/create')
  @Render('create_chatroom')
  async getChatRoomCreate() {
    const members = await this.chatService.getMemberList();
    return { members }; // EJS 로 members 넘김
  }

  // 룸 생성

  @Post('room/create')
  async postRoomCreate(@Body() CreateRoomDto: CreateRoomDto) {
    const chattingRoomCode = this.userService.generateRandomString(32); // ✅ 이렇게 사용

    console.log('chattingRoomCode', chattingRoomCode);
    console.log('CreateRoomDto', CreateRoomDto);

    const members = await this.chatService.createRoom(
      chattingRoomCode,
      CreateRoomDto,
    );
    return { members }; // EJS 로 members 넘김
  }

  // 룸 리스트 페이지 렌더링
  @Get('rooms')
  @Render('chatroom')
  async getChatRooms() {
    const roomList = await this.chatService.getChatRooms();
    console.log('roomList', roomList);
    return { roomList };
  }

  @Get('roominfo')
  async getRoomInfo() {
    return await this.chatService.getChatRooms();
  }

  @Get('member')
  async getMembers(@Query('cr_idx') cr_idx: string) {
    return await this.chatService.getChatMembers(parseInt(cr_idx, 10));
  }

  @Post()
  async postMessage(@Body() body: any) {
    const { msg, chattingRoomId, regID, regName } = body;
    await this.chatService.createChatting(msg, chattingRoomId, regID, regName);
    return { code: 200, result: 'ok' };
  }

  // 룸 대화 내용 랜더링,,

  @Get('room/:roomId')
  @Render('chatting') // chatRoom.ejs
  async getChatRoomDetail(@Param('roomId') roomId: string) {
    const { memberList, messages } =
      await this.chatService.getRoomDetail(roomId);

    const messagesWithNames = messages.map((msg) => {
      const target = memberList.find((m) => m.cm_idx === msg.target_idx);
      return {
        ...msg,
        target_name: target ? target.user_name : '',
      };
    });

    return { roomId, memberList, messages: messagesWithNames };
  }

  // 데이터 보냄 ..

  @Post('room/:roomId/send')
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() createChatDto: CreateChatDto,
  ) {
    await this.chatService.sendMessage(roomId, createChatDto);

    return { code: 200, result: 'ok' };
  }
}
