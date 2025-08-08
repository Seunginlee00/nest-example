import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ CORS 설정
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://hoppscotch.io',
      'http://hopps.470.co.kr/',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // views 폴더 경로 설정
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');


  const expressApp = app.getHttpAdapter().getInstance();


  expressApp.get('*', (req: Request, res: Response) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });

  await app.listen(3000);
}
bootstrap();
