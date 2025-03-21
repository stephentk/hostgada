import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { Op } from "sequelize";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}
  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ where: { email } });
    return user || undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.userModel.findByPk(id);
    return user || undefined;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.update({ 
      password: hashedPassword },
      { where: { id: userId } },
    );
  }
  
  async storeResetToken(userId: string, hashedToken: string): Promise<void> {
    await this.userModel.update(
      { resetToken: hashedToken, resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) }, // Token expires in 15 mins
      { where: { id: userId } }
    );
  }

  async getResetToken(userId: string): Promise<string | null> {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
        resetToken: { [Op.ne]: null }, 
        resetTokenExpiry: { [Op.gt]: new Date() }, 
      },
    });

    return user ? user.resetToken : null;
  }


  async clearResetToken(userId: string): Promise<void> {
    await this.userModel.update(
      { resetToken: null, resetTokenExpiry: null },
      { where: { id: userId } }
    );
  }  
  
}