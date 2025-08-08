// 로마(넉스트) 법 따르기 버전
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsArray()
  @IsNumber({}, { each: true })
  user_idx!: number[];

  @IsArray()
  @IsString({ each: true })
  user_id!: string[];

  @IsString()
  join_type!: string; // 추가된 사람인지

  @IsString()
  chat_type!: string; // 그룹방인지 일대일인지
}
