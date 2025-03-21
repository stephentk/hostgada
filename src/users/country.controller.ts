import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './country.dto';
import { Public } from 'src/authentication/auth.decorator';


@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @Public()
  async createCountry(@Body() dto: CreateCountryDto) {
    const country = await this.countryService.createCountry(dto);
    return { message: 'Country created successfully', country };
  }

  @Get()
  @Public()
  async getAllCountries() {
    return this.countryService.getAllCountries();
  }

  @Get(':id')
  @Public()
  async getCountryById(@Param('id') id: string) {
    return this.countryService.getCountryById(id);
  }
}
