"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_model_1 = require("../users/user.model");
const otp_model_1 = require("../otp/otp.model");
const otp_service_1 = require("../otp/otp.service");
const file_service_1 = require("../file services/file.service");
const country_service_1 = require("../users/country.service");
const country_model_1 = require("../users/country.model");
const user_service_1 = require("../users/user.service");
const jwt_guard_1 = require("./jwt.guard");
const core_1 = require("@nestjs/core");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([user_model_1.User, otp_model_1.Otp, country_model_1.Country])],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, otp_service_1.OtpService, user_service_1.UserService, file_service_1.ZohoMailService, file_service_1.CloudinaryService, country_service_1.CountryService, jwt_guard_1.JwtAuthGuard, core_1.Reflector],
        exports: [jwt_guard_1.JwtAuthGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map