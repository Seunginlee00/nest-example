import { IsNumber, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  sender!: number;

  @IsString()
  message!: string;
}
