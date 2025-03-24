import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Express } from 'express';
import { Multer } from 'multer';
import { InjectModel } from '@nestjs/sequelize';
import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/users/user.model';
import { CloudinaryService, ZohoMailService } from 'src/file services/file.service';
import { CountryService } from 'src/users/country.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly otpService: OtpService,
    private readonly zohoMailService: ZohoMailService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly countryService:CountryService 
  ) {}

  async register(email: string, password: string, role: string): Promise<User> {
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      completeProfile:false
    } as User);

    const otp = await this.otpService.generateOtp(user.id);
    console.log("otp",otp)
  // await this.zohoMailService.sendOtp(email, otp);
    user.completeProfile = false

    await user.save()

    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user =   await this.userModel.findOne({ where: { email } })
    if (!user || !user.password){
    throw new BadRequestException('Reset password to continue');
    }
     if (!user.completeProfile) {
       throw new BadRequestException('Please complete your profile to continue');
   }
  

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role:user.role 
    };

    const secret = process.env.JWT_SECRET;
      if (!secret) {
            throw new UnauthorizedException('Missing JWT  login secret');
          }
    return {
      access_token: jwt.sign(payload, secret, { expiresIn: '60m' }),
    };
  }

  
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.otpService.verifyOtp(user.id, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isVerified = true;
    await user.save();
    return true;
  }

  async updateDetails(email: string, details: any, imageFile?:  Express.Multer.File): Promise<User> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new BadRequestException('User not verified');
    }

 

    
    user.name = details.name;
    user.address = details.address;
  
    if (details.countryId) {
      const country = await this.countryService.getCountryById(details.countryId);
      if (!country) {
        throw new NotFoundException('Country not found');
      }
      user.countryId = country.id;
    }


    
    if (user.role === 'host') {
      user.hostName = details.hostName;
      user.bio = details.bio;
      user.linkedin = details.linkedin;
      user.twitter = details.twitter;
      user.instagram = details.instagram;
      user.facebook = details.facebook;

      if (imageFile) {
        const imageUrl = await this.cloudinaryService.uploadImage(imageFile);
        user.imageUrl = imageUrl;
      }
    }
  user.completeProfile = true
    await user.save();
    return user;
  }
}
