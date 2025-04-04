import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as express from 'express';
import { JwtAuthGuard } from './authentication/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
import { Handler, Request, Response, NextFunction } from 'express';
config(); // Ensure .env variables are loaded




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const jwtAuthGuard = app.get(JwtAuthGuard);
  app.useGlobalGuards(jwtAuthGuard);
  const port = process.env.PORT || 10000;
  await app.listen(port, '0.0.0.0');
  config();

  global.gc && global.gc(); // Force garbage collection if enabled




}
bootstrap();
