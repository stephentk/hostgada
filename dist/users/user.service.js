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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("./user.model");
const sequelize_2 = require("sequelize");
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findByEmail(email) {
        const user = await this.userModel.findOne({ where: { email } });
        return user || undefined;
    }
    async findById(id) {
        const user = await this.userModel.findByPk(id);
        return user || undefined;
    }
    async updatePassword(userId, hashedPassword) {
        await this.userModel.update({
            password: hashedPassword
        }, { where: { id: userId } });
    }
    async storeResetToken(userId, hashedToken) {
        await this.userModel.update({ resetToken: hashedToken, resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) }, { where: { id: userId } });
    }
    async getResetToken(userId) {
        const user = await this.userModel.findOne({
            where: {
                id: userId,
                resetToken: { [sequelize_2.Op.ne]: null },
                resetTokenExpiry: { [sequelize_2.Op.gt]: new Date() },
            },
        });
        return user ? user.resetToken : null;
    }
    async clearResetToken(userId) {
        await this.userModel.update({ resetToken: null, resetTokenExpiry: null }, { where: { id: userId } });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.User)),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map