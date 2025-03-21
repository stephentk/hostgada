import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Country } from './country.model';

@Table({ tableName: 'User' })
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Country)
  @Column({ type: DataType.UUID, allowNull: true })
  declare countryId: string;

  @BelongsTo(() => Country)
  declare country: Country;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false }) 
  declare completeProfile: boolean;  // ✅ Fixed type

  // Role: 'guest' or 'host'
  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'guest' })
  declare role: string;

  // Indicates whether OTP verification is complete
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isVerified: boolean;

  // Common additional details
  @Column({ type: DataType.STRING, allowNull: true })
  declare name: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare address: string | null;

  // Host-specific fields
  @Column({ type: DataType.STRING, allowNull: true })
  declare hostName: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare bio: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare linkedin: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare twitter: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare instagram: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare facebook: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare imageUrl: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare resetToken: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare resetTokenExpiry: Date | null;
}
