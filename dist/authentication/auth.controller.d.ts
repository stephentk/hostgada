import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ResetPasswordDto, UpdateDetailsDto } from './auth.dto';
import { VerifyOtpDto } from 'src/otp/otp.dto';
import { UserService } from 'src/users/user.service';
import { ZohoMailService } from 'src/file services/file.service';
export declare class AuthController {
    private readonly authService;
    private readonly zohoMailService;
    private readonly usersService;
    constructor(authService: AuthService, zohoMailService: ZohoMailService, usersService: UserService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    updateDetails(updateDetailsDto: UpdateDetailsDto, file?: Express.Multer.File): Promise<{
        message: string;
        user: import("../users/user.model").User;
    }>;
    forgotPassword(email: string): Promise<string>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string>;
}
