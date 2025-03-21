import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/user.model';

@Table({ tableName: 'Otp' })
export class Otp extends Model<Otp> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
      })
   declare   id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare otpCode: string;

  // Set expiry to, for example, 5 minutes after creation
  @Column({ type: DataType.DATE, allowNull: false })
  declare expiresAt: Date;

  @BelongsTo(() => User)
  user: User;
}
