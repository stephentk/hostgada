import { CountryService } from './country.service';
import { CreateCountryDto } from './country.dto';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    createCountry(dto: CreateCountryDto): Promise<{
        message: string;
        country: import("./country.model").Country;
    }>;
    getAllCountries(): Promise<import("./country.model").Country[]>;
    getCountryById(id: string): Promise<import("./country.model").Country>;
}
