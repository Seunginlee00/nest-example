import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getRandomChatRoomId(): string {
    const chattingRoomId = this.userService.generateRandomString(32);
    console.log('chattingRoomId:', chattingRoomId);
    return `respond with a resource ${chattingRoomId}`;
  }
}
