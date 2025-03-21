import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Country } from './country.model';
import { CreateCountryDto } from './country.dto';

@Injectable()
export class CountryService {
  constructor(@InjectModel(Country) private readonly countryModel: typeof Country) {}

  async createCountry(dto: CreateCountryDto): Promise<Country> {
    return this.countryModel.create(dto as Country);
  }

  async getAllCountries(): Promise<Country[]> {
    return this.countryModel.findAll();
  }

  async getCountryById(id: string): Promise<Country> {
    const country = await this.countryModel.findByPk(id);
    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return country;
  }
}
