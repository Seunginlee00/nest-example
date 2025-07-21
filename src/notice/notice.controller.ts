import { Controller, Post, Body, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './../dto/CreateNoticeDto';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  async createNotice(
    @Body() createNoticeDto: CreateNoticeDto,
    // @Res() res: Response, // 🔥 Express Response 객체 주입
  ) {
    console.log(createNoticeDto.isApi);
    console.log(createNoticeDto.notiIdx);
    await this.noticeService.createNotice(createNoticeDto); // ✅

    return {
      success: true,
      message: '공지사항이 성공적으로 생성되었습니다.',
    };

    // return res.redirect('/'); // ✅ 처리 후 메인으로 리다이렉트
  }

  @Get()
  @Render('notice')
  async showNoticePage() {
    return { notices: ['공지1', '공지2', '공지3'] };
  }
}
