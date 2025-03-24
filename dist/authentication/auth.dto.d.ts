export declare class RegisterDto {
    email: string;
    password: string;
    role: string;
}
export declare class UpdateDetailsDto {
    email: string;
    name?: string;
    address?: string;
    countryId?: string;
    hostName?: string;
    bio?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
}
export declare class ResetPasswordDto {
    readonly token: string;
    newPassword: string;
    confirmPassword: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
