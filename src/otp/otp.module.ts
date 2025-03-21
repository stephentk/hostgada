import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Otp } from 'src/otp/otp.model';
import { OtpService } from 'src/otp/otp.service';
import { CloudinaryService, ZohoMailService } from 'src/file services/file.service';

@Module({
  imports: [SequelizeModule.forFeature([ Otp])],
  providers: [ OtpService],
})
export class OtpModule {}
