import { Model } from 'sequelize-typescript';
import { Country } from './country.model';
export declare class User extends Model<User> {
    id: string;
    countryId: string;
    country: Country;
    email: string;
    password: string;
    completeProfile: boolean;
    role: string;
    isVerified: boolean;
    name: string | null;
    address: string | null;
    hostName: string | null;
    bio: string | null;
    linkedin: string | null;
    twitter: string | null;
    instagram: string | null;
    facebook: string | null;
    imageUrl: string | null;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
}
