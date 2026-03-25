// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // เปิด CORS
  app.enableCors();
  // เสิร์ฟไฟล์จาก /uploads เป็น static
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error(err);
});
