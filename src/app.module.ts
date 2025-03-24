import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './authentication/auth.module';
import { FileModule } from './file services/file.module';
import { OtpModule } from './otp/otp.module';
import { UserModule } from './users/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authentication/jwt.guard';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      logging: false, // disable logging of SQL queries
   // prevents auto-syncing of models on startup
      autoLoadModels: true,
      synchronize: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // This allows self-signed certificates
        },
      }, // Disable in production
    }),
    AuthModule,FileModule,OtpModule,UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 👈 Global Guard
    },
  ],
})
export class AppModule {}
