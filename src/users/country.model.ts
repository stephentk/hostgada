import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'country', timestamps: true })
export class Country extends Model<Country> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
declare id: string 

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
 declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
 declare code: string;

  @HasMany(() => User)
declare  users: User[];
}
