import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CloudinaryService, ZohoMailService } from 'src/file services/file.service';

@Module({
  imports: [SequelizeModule.forFeature([ ])],
  providers: [ ZohoMailService ,CloudinaryService],
})
export class FileModule {}
