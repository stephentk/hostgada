import { Controller, Post, Body, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, UnauthorizedException, BadRequestException, Patch } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { diskStorage, Multer } from 'multer';
import { Express } from 'express';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginDto, RegisterDto, ResetPasswordDto, UpdateDetailsDto } from './auth.dto';
import { VerifyOtpDto } from 'src/otp/otp.dto';
import { Public } from './auth.decorator';
import { UserService } from 'src/users/user.service';
import { ZohoMailService } from 'src/file services/file.service';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly zohoMailService: ZohoMailService,
    private readonly usersService: UserService,
  ) {}
  


  @Post('register')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() registerDto: RegisterDto) {
    const { email, password, role } = registerDto;
    const user = await this.authService.register(email, password, role);

    return {
      message: 'User registered. Please check your email for the OTP.',
      userId: user.id,
    };
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto:LoginDto ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }


  @Post('verify-otp')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp } = verifyOtpDto;
    await this.authService.verifyOtp(email, otp);

    return { message: 'OTP verified. You can now update your details.' };
  }

  // Update details endpoint
  // Uses file upload for host images
  // @Patch('update-details')
  // @Public()
  // @UseInterceptors(FileInterceptor('image'))
  // @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  // async updateDetails(
  //   @Body() updateDetailsDto: UpdateDetailsDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   const { email } = updateDetailsDto;

  //   if (!file) {
  //     throw new BadRequestException('File is missing');
  //   }
  
  //   const user = await this.authService.updateDetails(email, updateDetailsDto, file);

  //   return {
  //     message: 'User details updated successfully',
  //     user,
  //   };
  // }

  @Patch('update-details')
  @Public()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
  }))
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateDetails(
    @Body() updateDetailsDto: UpdateDetailsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is missing');
  
    const user = await this.authService.updateDetails(updateDetailsDto.email, updateDetailsDto, file);
  
    return { message: 'User details updated successfully', user };
  }
  

  @Post('forgot-password')
  @Public() 
  async forgotPassword(@Body('email') email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist.');
    }

    const payload = { email: user.email, id: user.id };

    const secret = process.env.PASSWORD_RESET_SECRET;
      if (!secret) {
            throw new UnauthorizedException('Missing JWT  login secret');
          }
    const token = jwt.sign(payload,secret, { expiresIn: '15min' });
    const hashedToken = await bcrypt.hash(token, 10);

   
    await this.usersService.storeResetToken(user.id, hashedToken);
  

    const resetLink = `https://example.com/reset-password?token=${token}`;
    console.log("jdjdj",resetLink);

   await this.zohoMailService.sendPasswordResetEmail(email, resetLink);

    return 'Password reset link has been sent to your email.';
  }

  @Patch('reset-password')
  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { token, newPassword,confirmPassword } = resetPasswordDto;

    try {
      const secret = process.env.PASSWORD_RESET_SECRET;
      if (!secret) {
        throw new UnauthorizedException('Missing JWT secret');
      }
      const payload = jwt.verify(token, secret);
      const user = await this.usersService.findById((payload as jwt.JwtPayload).id);

      if (!user) {
        throw new BadRequestException('Invalid User.');
      }
      const storedHashedToken = await this.usersService.getResetToken(user.id);
      if (!storedHashedToken) {
        throw new BadRequestException('Invalid or expired link.');
      }
  

      const isTokenValid = await bcrypt.compare(token, storedHashedToken);
      if (!isTokenValid) {
        throw new BadRequestException('Invalid or expired link');
      }
  
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Passwords do not match.');
      }
      if (!user) {
        throw new BadRequestException('Invalid User.');
      }
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Password Different.');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(user.id, hashedPassword);

      await this.usersService.clearResetToken(user.id);


      return 'Password has been successfully updated.';
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }
}
