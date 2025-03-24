import { Model } from 'sequelize-typescript';
import { User } from 'src/users/user.model';
export declare class Otp extends Model<Otp> {
    id: string;
    userId: string;
    otpCode: string;
    expiresAt: Date;
    user: User;
}
