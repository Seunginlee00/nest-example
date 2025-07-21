import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoticeDto {
  @IsNotEmpty()
  @IsString()
  msg!: string;

  @IsNotEmpty()
  @IsString()
  notiType!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  notiIdx!: number;

  @Type(() => Number)
  @IsNumber()
  isApi?: number;
}
