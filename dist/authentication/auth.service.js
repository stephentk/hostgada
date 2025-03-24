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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize_1 = require("@nestjs/sequelize");
const otp_service_1 = require("../otp/otp.service");
const user_model_1 = require("../users/user.model");
const file_service_1 = require("../file services/file.service");
const country_service_1 = require("../users/country.service");
let AuthService = class AuthService {
    userModel;
    otpService;
    zohoMailService;
    cloudinaryService;
    countryService;
    constructor(userModel, otpService, zohoMailService, cloudinaryService, countryService) {
        this.userModel = userModel;
        this.otpService = otpService;
        this.zohoMailService = zohoMailService;
        this.cloudinaryService = cloudinaryService;
        this.countryService = countryService;
    }
    async register(email, password, role) {
        const existingUser = await this.userModel.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            completeProfile: false
        });
        const otp = await this.otpService.generateOtp(user.id);
        console.log("otp", otp);
        user.completeProfile = false;
        await user.save();
        return user;
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user || !user.password) {
            throw new common_1.BadRequestException('Reset password to continue');
        }
        if (!user.completeProfile) {
            throw new common_1.BadRequestException('Please complete your profile to continue');
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new common_1.UnauthorizedException('Missing JWT  login secret');
        }
        return {
            access_token: jwt.sign(payload, secret, { expiresIn: '60m' }),
        };
    }
    async verifyOtp(email, otp) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isValid = await this.otpService.verifyOtp(user.id, otp);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        user.isVerified = true;
        await user.save();
        return true;
    }
    async updateDetails(email, details, imageFile) {
        const user = await this.userModel.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.isVerified) {
            throw new common_1.BadRequestException('User not verified');
        }
        user.name = details.name;
        user.address = details.address;
        if (details.countryId) {
            const country = await this.countryService.getCountryById(details.countryId);
            if (!country) {
                throw new common_1.NotFoundException('Country not found');
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
        user.completeProfile = true;
        await user.save();
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object, otp_service_1.OtpService,
        file_service_1.ZohoMailService,
        file_service_1.CloudinaryService,
        country_service_1.CountryService])
], AuthService);
//# sourceMappingURL=auth.service.js.map