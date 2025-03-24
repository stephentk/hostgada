"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer_1 = require("multer");
const auth_service_1 = require("./auth.service");
const platform_express_1 = require("@nestjs/platform-express");
const auth_dto_1 = require("./auth.dto");
const otp_dto_1 = require("../otp/otp.dto");
const auth_decorator_1 = require("./auth.decorator");
const user_service_1 = require("../users/user.service");
const file_service_1 = require("../file services/file.service");
let AuthController = class AuthController {
    authService;
    zohoMailService;
    usersService;
    constructor(authService, zohoMailService, usersService) {
        this.authService = authService;
        this.zohoMailService = zohoMailService;
        this.usersService = usersService;
    }
    async register(registerDto) {
        const { email, password, role } = registerDto;
        const user = await this.authService.register(email, password, role);
        return {
            message: 'User registered. Please check your email for the OTP.',
            userId: user.id,
        };
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
    async verifyOtp(verifyOtpDto) {
        const { email, otp } = verifyOtpDto;
        await this.authService.verifyOtp(email, otp);
        return { message: 'OTP verified. You can now update your details.' };
    }
    async updateDetails(updateDetailsDto, file) {
        if (!file)
            throw new common_1.BadRequestException('File is missing');
        const user = await this.authService.updateDetails(updateDetailsDto.email, updateDetailsDto, file);
        return { message: 'User details updated successfully', user };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User with this email does not exist.');
        }
        const payload = { email: user.email, id: user.id };
        const secret = process.env.PASSWORD_RESET_SECRET;
        if (!secret) {
            throw new common_1.UnauthorizedException('Missing JWT  login secret');
        }
        const token = jwt.sign(payload, secret, { expiresIn: '15min' });
        const hashedToken = await bcrypt.hash(token, 10);
        await this.usersService.storeResetToken(user.id, hashedToken);
        const resetLink = `https://example.com/reset-password?token=${token}`;
        console.log("jdjdj", resetLink);
        await this.zohoMailService.sendPasswordResetEmail(email, resetLink);
        return 'Password reset link has been sent to your email.';
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword, confirmPassword } = resetPasswordDto;
        try {
            const secret = process.env.PASSWORD_RESET_SECRET;
            if (!secret) {
                throw new common_1.UnauthorizedException('Missing JWT secret');
            }
            const payload = jwt.verify(token, secret);
            const user = await this.usersService.findById(payload.id);
            if (!user) {
                throw new common_1.BadRequestException('Invalid User.');
            }
            const storedHashedToken = await this.usersService.getResetToken(user.id);
            if (!storedHashedToken) {
                throw new common_1.BadRequestException('Invalid or expired link.');
            }
            const isTokenValid = await bcrypt.compare(token, storedHashedToken);
            if (!isTokenValid) {
                throw new common_1.BadRequestException('Invalid or expired link');
            }
            if (newPassword !== confirmPassword) {
                throw new common_1.BadRequestException('Passwords do not match.');
            }
            if (!user) {
                throw new common_1.BadRequestException('Invalid User.');
            }
            if (newPassword !== confirmPassword) {
                throw new common_1.BadRequestException('Password Different.');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.usersService.updatePassword(user.id, hashedPassword);
            await this.usersService.clearResetToken(user.id);
            return 'Password has been successfully updated.';
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired token.');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, auth_decorator_1.Public)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, auth_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, auth_decorator_1.Public)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Patch)('update-details'),
    (0, auth_decorator_1.Public)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
        }),
    })),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.UpdateDetailsDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateDetails", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, auth_decorator_1.Public)(),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Patch)('reset-password'),
    (0, auth_decorator_1.Public)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        file_service_1.ZohoMailService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map