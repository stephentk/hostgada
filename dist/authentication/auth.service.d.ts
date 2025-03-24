import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/users/user.model';
import { CloudinaryService, ZohoMailService } from 'src/file services/file.service';
import { CountryService } from 'src/users/country.service';
export declare class AuthService {
    private readonly userModel;
    private readonly otpService;
    private readonly zohoMailService;
    private readonly cloudinaryService;
    private readonly countryService;
    constructor(userModel: typeof User, otpService: OtpService, zohoMailService: ZohoMailService, cloudinaryService: CloudinaryService, countryService: CountryService);
    register(email: string, password: string, role: string): Promise<User>;
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    updateDetails(email: string, details: any, imageFile?: Express.Multer.File): Promise<User>;
}
