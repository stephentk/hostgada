import { Model } from 'sequelize-typescript';
import { User } from './user.model';
export declare class Country extends Model<Country> {
    id: string;
    name: string;
    code: string;
    users: User[];
}
