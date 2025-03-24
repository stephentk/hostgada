import { Otp } from './otp.model';
export declare class OtpService {
    private readonly otpModel;
    constructor(otpModel: typeof Otp);
    generateOtp(userId: string): Promise<string>;
    verifyOtp(userId: string, otp: string): Promise<boolean>;
}
