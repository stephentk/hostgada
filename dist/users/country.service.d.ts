import { Country } from './country.model';
import { CreateCountryDto } from './country.dto';
export declare class CountryService {
    private readonly countryModel;
    constructor(countryModel: typeof Country);
    createCountry(dto: CreateCountryDto): Promise<Country>;
    getAllCountries(): Promise<Country[]>;
    getCountryById(id: string): Promise<Country>;
}
