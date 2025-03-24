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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const otp_model_1 = require("./otp.model");
const crypto = require("crypto");
let OtpService = class OtpService {
    otpModel;
    constructor(otpModel) {
        this.otpModel = otpModel;
    }
    async generateOtp(userId) {
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.otpModel.create({
            userId,
            otpCode: otp,
            expiresAt,
        });
        return otp;
    }
    async verifyOtp(userId, otp) {
        const otpRecord = await this.otpModel.findOne({ where: { userId } });
        if (!otpRecord)
            return false;
        if (new Date() > otpRecord.expiresAt) {
            await otpRecord.destroy();
            return false;
        }
        if (otpRecord.otpCode !== otp) {
            return false;
        }
        await otpRecord.destroy();
        return true;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(otp_model_1.Otp)),
    __metadata("design:paramtypes", [Object])
], OtpService);
//# sourceMappingURL=otp.service.js.map