import { Controller, Post, Body, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  async createNotice(
    @Body('msg') msg: string,
    @Body('notiType') notiType: string,
    @Body('notiIdx') notiIdx: number,
    @Body('isApi') isApi: number,
    @Res() res: Response, // 🔥 Express Response 객체 주입
  ) {
    await this.noticeService.createNotice({
      msg,
      notiType,
      notiIdx,
      isApi,
    });

    return res.redirect('/'); // ✅ 처리 후 메인으로 리다이렉트
  }

  @Get()
  @Render('notice')
  async showNoticePage() {
    return { notices: ['공지1', '공지2', '공지3'] };
  }
}
