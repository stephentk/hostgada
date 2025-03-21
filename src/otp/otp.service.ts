import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Otp } from './otp.model';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp)
    private readonly otpModel: typeof Otp,
  ) {}

  // Generate an OTP with a 5-minute expiry
  async generateOtp(userId: string): Promise<string> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpModel.create({
      userId,
      otpCode: otp,
      expiresAt,
    } as Otp);
    return otp;
  }

  // Verify the OTP and delete it if valid
  async verifyOtp(userId: string, otp: string): Promise<boolean> {
    const otpRecord = await this.otpModel.findOne({ where: { userId } });
    if (!otpRecord) return false;

    if (new Date() > otpRecord.expiresAt) {
      await otpRecord.destroy();
      return false;
    }

    if (otpRecord.otpCode !== otp) {
      return false;
    }

    await otpRecord.destroy();
    return true;
  }
}
