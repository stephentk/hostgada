import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { JwtAuthGuard } from './authentication/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
config(); // Ensure .env variables are loaded


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const jwtAuthGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(jwtAuthGuard);
  await app.listen(process.env.PORT ?? 3000);
  config();



}
bootstrap();
