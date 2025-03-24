import { User } from "./user.model";
export declare class UserService {
    private readonly userModel;
    constructor(userModel: typeof User);
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    updatePassword(userId: string, hashedPassword: string): Promise<void>;
    storeResetToken(userId: string, hashedToken: string): Promise<void>;
    getResetToken(userId: string): Promise<string | null>;
    clearResetToken(userId: string): Promise<void>;
}
