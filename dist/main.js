"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv_1 = require("dotenv");
const jwt_guard_1 = require("./authentication/jwt.guard");
const common_1 = require("@nestjs/common");
(0, dotenv_1.config)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const jwtAuthGuard = app.get(jwt_guard_1.JwtAuthGuard);
    app.useGlobalGuards(jwtAuthGuard);
    await app.listen(process.env.PORT || 5432);
    (0, dotenv_1.config)();
}
bootstrap();
//# sourceMappingURL=main.js.map