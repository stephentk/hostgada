export declare class ZohoMailService {
    private readonly apiUrl;
    private readonly authToken;
    private readonly fromAddress;
    constructor();
    sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
    sendOtp(email: string, otp: string): Promise<void>;
}
export declare class CloudinaryService {
    constructor();
    uploadImage(file: Express.Multer.File): Promise<string>;
}
export declare class CloudflareService {
    private s3;
    constructor();
    uploadImage(file: Express.Multer.File): Promise<string>;
}
