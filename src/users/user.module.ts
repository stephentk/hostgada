import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CloudinaryService, ZohoMailService } from 'src/file services/file.service';
import { User } from './user.model';
import { UserService } from './user.service';
import { CountryService } from './country.service';
import { Country } from './country.model';

@Module({
  imports: [SequelizeModule.forFeature([User,Country ])],
  providers: [ UserService,CountryService],
})
export class UserModule {}
