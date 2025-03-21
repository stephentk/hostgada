import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  role: string;
}

export class UpdateDetailsDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

 
  @IsOptional()
  @IsUUID()
  countryId?: string;


  // Fields for host users
  @IsOptional()
  @IsString()
  hostName?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  facebook?: string;
}
export class ResetPasswordDto {
    @IsString()
    readonly token: string;
  
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
   newPassword: string;
  
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
     confirmPassword: string;
  }

  export class LoginDto {
    @IsString()
    email: string;
  
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
   password: string;
  
  }