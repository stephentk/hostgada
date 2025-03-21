import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';
import { User } from 'src/users/user.model';
import { Otp } from 'src/otp/otp.model';
import { OtpService } from 'src/otp/otp.service';
import { CloudinaryService, ZohoMailService } from 'src/file services/file.service';
import { CountryService } from 'src/users/country.service';
import { Country } from 'src/users/country.model';
import { UserService } from 'src/users/user.service';
import { JwtAuthGuard } from './jwt.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [SequelizeModule.forFeature([User, Otp,Country])],
  controllers: [AuthController],
  providers: [AuthService, OtpService, UserService,ZohoMailService, CloudinaryService,CountryService,JwtAuthGuard, Reflector],
  exports: [JwtAuthGuard], 
  
})
export class AuthModule {}
