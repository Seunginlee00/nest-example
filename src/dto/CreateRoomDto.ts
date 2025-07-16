// 로마(넉스트) 법 따르기 버전
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsArray()
  @IsNumber({}, { each: true })
  userId!: number[];

  @IsArray()
  @IsString({ each: true })
  userName!: string[];

  @IsNumber()
  regId!: number;
}
