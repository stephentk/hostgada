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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareService = exports.CloudinaryService = exports.ZohoMailService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const cloudinary_1 = require("cloudinary");
const aws_sdk_1 = require("aws-sdk");
let ZohoMailService = class ZohoMailService {
    apiUrl;
    authToken;
    fromAddress;
    constructor() {
        this.apiUrl = process.env.ZOHO_MAIL_API_URL || '';
        if (!this.apiUrl) {
            throw new Error('ZOHO_MAIL_API_URL is not defined in the environment variables');
        }
        this.authToken = process.env.ZOHO_MAIL_AUTH_TOKEN || '';
        if (!this.authToken) {
            throw new Error('ZOHO_MAIL_AUTH_TOKEN is not defined in the environment variables');
        }
        this.fromAddress = process.env.ZOHO_MAIL_FROM || '';
        if (!this.fromAddress) {
            throw new Error('ZOHO_MAIL_FROM is not defined in the environment variables');
        }
    }
    async sendPasswordResetEmail(email, resetLink) {
        const payload = {
            fromAddress: this.fromAddress,
            toAddress: email,
            subject: 'Password Reset Request',
            content: `Please click the following link to reset your password: ${resetLink}`,
        };
        try {
            const response = await axios_1.default.post(this.apiUrl, payload, {
                headers: {
                    Authorization: `Zoho-oauthtoken ${this.authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status !== 200) {
                throw new common_1.HttpException('Failed to send email via Zoho Mail', common_1.HttpStatus.BAD_GATEWAY);
            }
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
            throw new common_1.HttpException(`Error sending password reset email: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
    async sendOtp(email, otp) {
        const payload = {
            fromAddress: this.fromAddress,
            toAddress: email,
            subject: 'Your OTP Code',
            content: `Your OTP code is: ${otp}`,
        };
        try {
            const response = await axios_1.default.post(this.apiUrl, payload, {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${this.authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status !== 200) {
                throw new common_1.HttpException('Failed to send email via Zoho Mail', common_1.HttpStatus.BAD_GATEWAY);
            }
        }
        catch (error) {
            console.error('Error sending OTP email:', error);
            throw new common_1.HttpException(`Error sending OTP email: ${error.message}`, common_1.HttpStatus.BAD_GATEWAY);
        }
    }
};
exports.ZohoMailService = ZohoMailService;
exports.ZohoMailService = ZohoMailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ZohoMailService);
let CloudinaryService = class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async uploadImage(file) {
        try {
            if (!file) {
                throw new common_1.InternalServerErrorException('File is missing');
            }
            const result = await cloudinary_1.v2.uploader.upload(file.path);
            return result.secure_url;
        }
        catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new common_1.InternalServerErrorException('Image upload failed');
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
let CloudflareService = class CloudflareService {
    s3;
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
            secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
            signatureVersion: 'v4',
        });
    }
    async uploadImage(file) {
        try {
            if (!file) {
                throw new common_1.InternalServerErrorException('File is missing');
            }
            const fileName = `image-${Date.now()}-${file.originalname}`;
            const uploadParams = {
                Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };
            await this.s3.upload(uploadParams).promise();
            return `https://${process.env.CLOUDFLARE_BUCKET_NAME}.r2.dev/${fileName}`;
        }
        catch (error) {
            console.error('Cloudflare R2 upload error:', error);
            throw new common_1.InternalServerErrorException('Image upload failed');
        }
    }
};
exports.CloudflareService = CloudflareService;
exports.CloudflareService = CloudflareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudflareService);
//# sourceMappingURL=file.service.js.map