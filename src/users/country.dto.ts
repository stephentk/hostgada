import { IsString, Length } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(2, 10)
  code: string;
}
