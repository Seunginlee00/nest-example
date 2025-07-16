import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // ⭐️ 이게 핵심
    }),
  );

  // views 폴더 경로 설정
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // view 엔진 설정 (ejs)
  app.setViewEngine('ejs');

  // 포트 번호 설정
  await app.listen(3000);
}
bootstrap();
