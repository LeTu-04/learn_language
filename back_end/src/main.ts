import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : 'http://localhost:5173',
    credential : true,
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE'
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,            // Tự động chuyển đổi dữ liệu sang kiểu trong DTO (vd: string "1" -> number 1)
    whitelist: true,            // Tự động loại bỏ các field không có trong DTO (Bảo mật)
    forbidNonWhitelisted: true, // (Tùy chọn) Báo lỗi luôn nếu client gửi thừa field rác
  }));
  await app.listen(process.env.PORT ?? 3000);
 
}
bootstrap();
